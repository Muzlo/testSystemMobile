<template>
<div>
      <h2 class="highTitle">选择试卷</h2>
      <ul class="options">
        <div v-for="option in dataList" :key="option.id">
          <li class="item"  @click="activeClass(option)" :class="{active : active == option.id}" >
            <span>{{option.tTest.testTitle}}</span>
          </li>
        </div>
        <p class="p" @click="startFn">开始答题</p>
      </ul>

</div>
</template>

<script>

export default {
  name: 'chooseTest',
  data(){
    return {
      dataList:[],
      active:'',
      id:'',
      testId:'',
      isFinishTest:'',
      testTime:null,
      userBonus:null,
      testPassBonus:null
    }
  },
  components: {},
  mounted(){

    if(!this.$route.params.data){
      this.$router.push({name:'login'}) 
    }else{
      this.dataList=this.$route.params.data
    }

  },
  methods:{
    activeClass(name){
      this.active = name.id;
      this.id=name.id;
      this.testId=name.testId;
      this.isFinishTest=name.isFinishTest;
      this.testTime=name.tTest.testTime;
      this.userBonus=name.userBonus;
      this.testPassBonus=name.tTest.testPassBonus;
    },
    startFn(){
      if(  this.$route.params.isFinishTest==1 || this.isFinishTest==1 ){
        this.$toast.center('您已答过该试卷！');
        this.$router.push({name:'answer',params: {testId:this.testId,userId:this.id,userBonus:this.userBonus,testPassBonus:this.testPassBonus,testList:this.$route.params.data}}) 
      }else if( this.isFinishTest==0 ){
        if(this.id.length*this.testId.length!=0 ){
          this.$router.push({name:'test',params: {id:this.id,testId:this.testId,testTime:this.testTime,testPassBonus:this.testPassBonus,testList:this.$route.params.data}}) 
        }else{
          this.$toast.center('未选择试卷！');
        }
      }
      
      
    }
  }
}
</script>
<style scoped lang="stylus">
  .highTitle
    padding:15px;
    font-size:.4rem;
    background:green;
    color:#fff;
    letter-spacing:2px;
    text-align:center;
  ul
    padding:15px;
    .p
      background-color:#4285f4;
      color:#fff;
      margin-top:15px;
    .p,.item 
      padding: 16px;
      margin-bottom: 8px;
      cursor: pointer;
      border: 1px solid #f1f1f1;
      font-size:.4rem;
      display:flex;
      align-items:center;
      justify-content:center;
    .active
      border: 1px solid #55a532;
      background-color: #f1f1f1;
    .selected
      border: 1px solid #55a532;
      background-color: #f1f1f1;
</style>