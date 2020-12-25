import Vue from 'vue'
import Router from 'vue-router'
import TaskTodo from '@/components/TaskTodo'


Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      component: TaskTodo
    },

  ]
})
