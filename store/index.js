import Vuex from 'vuex'
import Cookie from 'js-cookie'

const createStore = () => {
  return new Vuex.Store({
    state: {
      loadedPosts: [],
      token: null
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
      },
      setToken(state, token) {
        state.token = token
      },
      clearToken(state) {
        state.token = null;
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
        // context.app.$axios is used because of asyncData. It is running on the server
        return context.app.$axios
          .$get('/posts.json')
          .then(data => {
            // Iterating through object with for/in loop and pushing it to the array.
            const postsArray = []
            for (const key in data) {
              postsArray.push({...data[key], id: key })
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
        return this.$axios
        .$post('https://nuxt-blog-777.firebaseio.com/posts.json?auth=' + vuexContext.state.token, createdPost)
        .then(data => {
          vuexContext.commit('addPost', {...createdPost, id: data.name})
        })
        .catch(error => console.log(error))
      },
      editPost(vuexContext, editedPost) {
        return this.$axios.$put('https://nuxt-blog-777.firebaseio.com/posts' + editedPost.id + '.json?auth=' + vuexContext.state.token, editedPost)
        .then(res => {
          vuexContext.commit('editPost', editedPost)
        })
        .catch(error => console.log(error))
      },
      setPosts(vuexContext, posts) {
        vuexContext.commit('setPosts', posts)
      },
      authenticateUser(vuexContext, authData) {
        let authUrl = 
        'https://www.googleapis.com/identitytoolkit/v3/relyingparty/verifyPassword?key=' + 
        process.env.fbAPIKey
      if (!authData.isLogin) {
        authUrl = 
          'https://www.googleapis.com/identitytoolkit/v3/relyingparty/signupNewUser?key=' +
          process.env.fbAPIKey
      }
      return this.$axios
      .$post(authUrl, {
        email: authData.email,
        password: authData.password,
        returnSecureToken: true
      })
      .then(result => {
        vuexContext.commit('setToken', result.idToken);
        localStorage.setItem('token', result.idToken);
        localStorage.setItem('tokenExpiration', new Date().getTime() + Number.parseInt(result.expiresIn) * 1000);
        Cookie.set('jwt', result.idToken);
        Cookie.set('expirationDate', new Date().getTime() + Number.parseInt(result.expiresIn) * 1000);
      })
      .catch(e => console.log(e));
      },
      initAuth(vuexContext, req) {
        let token;
        let expirationDate;
        if (req) {
          if (!req.headers.cookie) {
            return;
          }
          const jwtCookie = req.headers.cookie
            .split(';')
            .find(c => c.trim().startsWith('jwt='));
          if (!jwtCookie) {
            return;
          }
          token = jwtCookie.split('=')[1];
          expirationDate = req.headers.cookie
            .split(';')
            .find(c => c.trim().startsWith('expirationDate='))
            .split('=')[1];
        } else {
          token = localStorage.getItem('token');
          expirationDate = localStorage.getItem('tokenExpiration');  
          }
          if (new Date().getTime() > +expirationDate || !token) {
            console.log('No token or invalid token');
            vuexContext.commit('clearToken');
            return;
        }  
        vuexContext.commit('setToken', token);
      }
    },
    getters: {
      loadedPosts(state) {
        return state.loadedPosts
      },
      isAuthenticated(state) {
        return state.token != null
      }
    }
  })
}

export default createStore
