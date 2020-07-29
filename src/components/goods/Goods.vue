<template>
  <div>
    商品列表
    <span>{{ mydata }}</span>
    <input @input="handleInput" :value="mydata" />
    <input oninput="printToChangeData()" />
    <button @click="printToConsole(mydata)">查看数据</button>
    <button @click="printToChangeData">改变数据</button>
  </div>
</template>

<script>
export default {
  data(){
    return{
      mydata: 'abc'
    }
  },
  methods:{
    handleInput(e){
      this.mydata = e.target.value;
    },
    printToConsole(stuff){
      console.log(stuff);
    },
    printToChangeData(){
      this.mydata += 1;
    },
  }
}
</script>

<style scoped>
</style>