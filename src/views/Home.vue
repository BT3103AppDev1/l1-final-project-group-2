<template>
  <main class="home">
    <PersonalPage @added="change" :key="refreshComp"/>

    
  </main>
</template>

<script>
import PersonalPage from '@/components/PersonalPage.vue'

export default {
  name: 'App',
  components: {
    PersonalPage
  },

  data() {
    return{
      refreshComp:0
    }
  },

  methods: {
    change(){
      this.refreshComp += 1
    }
  }
}
</script>
