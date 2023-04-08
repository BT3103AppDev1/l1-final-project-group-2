<template>
  <main class="home">
    <!-- refresh page when called in PersonalPage -->
    <PersonalPage @added="change" @changedStatus="change" @deleted="change" :key="refreshComp"/>
    

    
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
