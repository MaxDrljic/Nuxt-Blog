import Vuex from 'vuex'

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
        return new Promise((resolve, reject) => {
          setTimeout(() => {
            vuexContext.commit('setPosts', [
                {
                  id: '1',
                  title: "First Post",
                  previewText: "This is my first post!",
                  thumbnail: "http://nerdsmagazine.com/wp-content/uploads/2013/07/tech_a_by_burnwell88-d4xz7ah.jpg"
                },
                {
                  id: '2',
                  title: "Second Post",
                  previewText: "This is my second post!",
                  thumbnail: "http://nerdsmagazine.com/wp-content/uploads/2013/07/tech_a_by_burnwell88-d4xz7ah.jpg"
                }
              ]);
           resolve();
         }, 1000);
        });
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
