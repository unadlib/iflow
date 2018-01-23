# Concepts Principles

>After using some state management libraries or containers, I always feel that there should be a new state management library, although it is a mutable structure, but it should be able to maintain the state of the original data type, it also supports immutable, while taking into account mutable for programming and operation, And it should be incremental, not disruptive to programming fun because of too much cumbersome operations, such as deconstruction spread Operator, and other complex concepts.
  
Therefore, iFlow attempts to build a new state management library based on **paths match** using Proxy & Reflect of ECMAScript 2015. What needs to be specifically stated is that the **iFlow definition store is comprised of actions and state**.


* **Paths Match**

The Getter Paths is obtained when the view component is referencing the state of the store, and the setter Path is obtained by proxy when the action is triggered. Pass the setter Path through the viewer and perform a quick Getter Paths Match in the connector.

* **Action Run Process**

The view component triggers the action, and the action executes with an advanced `addInterceptor` set of blocking middleware, and then if there is a standard middleware within the action that has to go through the `addMiddleware` setting, Then the state operation is performed, then the observation middleware is set through `addObserver` until the action completes, and then at the end of the call `addListener` set up the listening middleware. Of course, **By default, these middleware are not set up and used, and are not entered into these middleware's**. By default, the state notification change used by the corresponding view is changed based on each state change, not the action at the end of each execution, and of course, we also provide [batch](/docs/api/batch.md) API to batch update state changes.
 


* **State Reference procedure**

The state of the store is processed by the selector (if there is a setting) and then through the connector, which is then inserted into the view component.
 
### How to work
![Data Flow](https://raw.githubusercontent.com/unadlib/iflow/master/assets/flowChart.png)

---
>Formula to express is: action (store) => store = newStore

---
Welcome to use iFlow!🎉🎉🎉
