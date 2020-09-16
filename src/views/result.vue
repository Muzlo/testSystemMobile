<template>
<div class="wrap">
  <div class="result">
    <p class="p" v-if="$route.params.score >= $route.params.testPassBonus">
      <img src="../public/img/happy.png" />
    </p>
    <p class="p" v-if="$route.params.score < $route.params.testPassBonus">
      <img src="../public/img/sad.png" />
    </p>
    <p class="p1">您的最终得分为：<span class="score">{{$route.params.score}}分</span>
      <span class="mt-15" v-if="$route.params.score >= $route.params.testPassBonus" style="display:block;font-size:14px;">成绩合格</span>
      <span class="mt-15" v-if="$route.params.score < $route.params.testPassBonus" style="display:block;font-size:14px;">成绩不合格</span>
    </p>
    <p class="p2">感谢您的参与！</p>
    <div class="p3 mt-15" @click="answerFn">查看答案</div>
    <div class="p3 mt-15" @click="goBackFn">返回试卷</div>
  </div>

</div>
</template>

<script>

export default {
  name: 'result',
  data(){
    return {
    }
  },
  components: {},
  mounted(){
    if(!this.$route.params.testId){
      this.$router.push({name:'login'});
    }
  },
  methods:{
    goBackFn(){
      this.$router.push({name:'chooseTest',params:{data:this.$route.params.testList,isFinishTest:1}})
    },
    answerFn(){
      this.$router.push({name:'answer',params: {testId:this.$route.params.testId,userId:this.$route.params.userId,userBonus:this.$route.params.score,testPassBonus:this.$route.params.testPassBonus,testList:this.$route.params.testList,isFinishTest:1}}) 
    }
  }
}
</script>
<style scoped lang="stylus">
.wrap
  position:relative;
  height:100%;
  .result
    width:80%;
    text-align:center;
    position: absolute;
    top: 30%;left: 50%;
    transform: translate(-50%,-50%);
    box-shadow: 0 0 20px #ccc;
    padding:50px 15px;
    .p
      img
        transform:scale(0.8)
    .p1
      margin:20px 0;
      font-size:.4rem;
      color:#333;
      .score
        color:red;
        font-weight:700;
    .p2
      font-size:.28rem;
      color:#ccc;  
    .p3
      padding:15px;
      color:#fff;
      font-size:.28rem;
      background-color:#009688;
      border-radius:6px;



</style>