<template>
  <div>
    权限管理
    <custom>
      <template slot="myslot1" slot-scope="myscope">{{ myscope.efg }}</template>
      <template slot="myslot2">abcd</template>
    </custom>
  </div>
</template>



<script>
import Roles from './Roles.vue'

export default {
  data(){
    return{
      mydata : 'abc'
    }
  },
  components: {
    "custom":Roles
  }

}
</script>

<style scoped>
</style>