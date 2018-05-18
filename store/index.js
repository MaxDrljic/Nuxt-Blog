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
        return axios.get('https://nuxt-blog-777.firebaseio.com/posts.json')
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
