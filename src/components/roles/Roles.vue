<template>
  <div>
    角色管理
    <slot name="myslot1" :efg="hi">xyz</slot>
    <slot name="myslot2"></slot>
    <div class="colorBox"></div>
    <span>{{ hi }}</span>
    <button @click="sayhi">Hi</button>
  </div>
</template>

<script>
export default {
  name: 'custom',
  data(){
    return{
      hi: 'hello from roles'
    }
  },
  methods: {
    sayhi(){
      alert('hi')
    }
  }
    
}
</script>

<style scoped>
.colorBox {
  width: 10px;
  height: 10px;
  background-color: red;
}
</style>