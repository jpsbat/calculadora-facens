<template>
  <div id="app">
    <div class="floating-elements">
      <div class="floating-element"></div>
      <div class="floating-element"></div>
      <div class="floating-element"></div>
    </div>
    <GradeCalculator />
  </div>
</template>

<script>
import GradeCalculator from './components/GradeCalculator.vue'

export default {
  name: 'App',
  components: {
    GradeCalculator
  }
}
</script>