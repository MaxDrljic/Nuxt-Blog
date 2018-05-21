import Vuex from 'vuex'
import axios from 'axios'

const createStore = () => {
  return new Vuex.Store({
    state: {
      loadedPosts: []
    },
    mutations: {
      setPosts(state, posts) {
        state.loadedPosts = posts
      },
      addPost(state, post) {
        // Simply push the post parameter to the store. post goes in loadedPosts array.
        state.loadedPosts.push(post)
      },
      editPost(state, editedPost) {
        // 1. Assign postIndex variable
        // 2. Perform a check where the post in the store is equal to the editedPost param (post which user chooses)
        // 3. Assign the current index of the post in the store to the editedPost params, mentioned in step 2.
        const postIndex = state.loadedPosts.findIndex(
          post => post.id === editedPost.id
        )
        state.loadedPosts[postIndex] = editedPost
      }
    },
    actions: {
      // Nuxt method to fetch data to the store, to avoid constantly using asyncData in every component.
      // nuxtServerInit is called once to pre-populate the store from the Server-Side, to avoid repetition with Async calls.
      // asyncData should be used for single posts based on their ID's, for specific type of data.
      // asyncData is only available in Page components.
      // fetch method can be used insted of asyncData, where asyncData creates data () {} object in the component where data is saved automatically.
      // fetch is similar to asyncData, but insted of saving it to the data object, data can be saved in the store, with the commit() method.

      nuxtServerInit(vuexContext, context) {
        return axios.get(process.env.baseUrl + '/posts.json')
          .then(res => {
            // Iterating through object with for/in loop and pushing it to the array.
            const postsArray = []
            for (const key in res.data) {
              postsArray.push({...res.data[key], id: key })
            }
            vuexContext.commit('setPosts', postsArray)
          })
          .catch(error => context.error(error));
      },
      addPost(vuexContext, post) {
        const createdPost = {
          ...post,
          updatedDate: new Date()
        }
        return axios
        .post('https://nuxt-blog-777.firebaseio.com/posts.json', createdPost)
        .then(result => {
          vuexContext.commit('addPost', {...createdPost, id: result.data.name})
        })
        .catch(error => console.log(error))
      },
      editPost(vuexContext, editedPost) {
        return axios.put('https://nuxt-blog-777.firebaseio.com/posts' + editedPost.id + '.json', editedPost)
        .then(res => {
          vuexContext.commit('editPost', editedPost)
        })
        .catch(error => console.log(error))
      },
      setPosts(vuexContext, posts) {
        vuexContext.commit('setPosts', posts)
      }
    },
    getters: {
      loadedPosts(state) {
        return state.loadedPosts
      }
    }
  })
}

export default createStore
