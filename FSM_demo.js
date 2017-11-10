const collection = {
  currentState: 'not_login',
  states: {
    not_login: {
      submit: {
        value: function(){
          //submit function
          //fetch('loginAPI').then(this.receiveSuccess).catch(this.receiveFailure)
          return this.collection.currentState = 'loading'
        }
      }
    },
    loading: {
      receiveSuccess: {
        value: function(){
          // tips success and route to `dial`
          return this.collection.currentState = 'dial'
        },
      },
      receiveFailure: {
        value: function(){
          // tips error
          return this.collection.currentState = 'error'
        }
      }
    },
    dial: {
      logout: {
        value: function(){
          // logout action
          return this.collection.currentState = 'not_login'
        }
      }
    },
    error: {
      retry: {
        value: function(){
          // retry action
          // fetch('loginAPI').then().catch()
          return this.collection.currentState = 'loading'
        }
      }
    }
  }
}

class FSM {
  constructor (collection){
    this.collection = collection
    Object.defineProperties(
      this,
      Object
        .entries(this.collection.states)
        .reduce((merger,[state,actions])=>Object.assign(merger,actions),{})
    )
  }
  get state(){
    return this.collection.currentState
  }
}
const fsm = new FSM(collection)

fsm.state
fsm.submit()