<template>
  <div class="container">
    <div class="row">
      <div class="col-12">
        <h1 class="mb-4">pense moi</h1>
        <div class="input-group mb-3">
          <input v-model="newTask" type="text" class="form-control" placeholder="ajoute une tache" @keyup.enter="addTask">
          <div class="input-group-append">
            <button class="btn btn-primary" type="button" @click="addTask">ajouter</button>
          </div>
        </div>
        <ul class="list-group">
          <li class="list-group-item" v-for="(task, index) in tasks" :key="index">
            <div class="form-check">
              <input type="checkbox" class="form-check-input" v-model="task.completed">
              <label class="form-check-label" :class="{ 'text-decoration-line-through': task.completed }">{{ task.text }}</label>
            </div>
            <button class="btn btn-danger btn-sm float-right" @click="removeTask(index)">supprimer</button>
          </li>
        </ul>
      </div>
    </div>
  </div>
</template>


<script>
import { onMounted, ref } from 'vue';

export default {
  name: 'Agenda',
  setup() {
    const newTask = ref('');
    const tasks = ref([]);

    const storedTasks = JSON.parse(localStorage.getItem('tasks')) || [];
    tasks.value = storedTasks;

    const addTask = () => {
      if (newTask.value.trim()) {
        tasks.value.push({ text: newTask.value, completed: false });
        newTask.value = '';
        saveTasks();
      }
    };

    const removeTask = (index) => {
      tasks.value.splice(index, 1);
      saveTasks();
    };

    const saveTasks = () => {
      localStorage.setItem('tasks', JSON.stringify(tasks.value));
    };

    onMounted(() => {
      window.addEventListener('beforeunload', saveTasks);
    });

    return {
      newTask,
      tasks,
      addTask,
      removeTask,
    };
  },
};
</script>

<style scoped>
.completed {
  text-decoration: line-through;
}
</style>
