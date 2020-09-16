<template>
<div>
      <h2 class="highTitle">答 案</h2>
      <p style="padding:15px 0 0 15px;font-size:16px;">您的分数是：{{$route.params.userBonus}}分
        <b style="font-size:14px;" v-if="$route.params.userBonus>=$route.params.testPassBonus">（成绩合格）</b>  
        <b style="font-size:14px;" v-else-if="$route.params.userBonus<$route.params.testPassBonus">（成绩不合格）</b>        
      </p>
      <ul class="options">
        <div v-for="option in data" :key="option.id">
          <li class="item">
            <p>问题：{{option.qPack.questionContent}}</p>
            <p>
              <span class="mr-15" v-if="option.qPack.answerA"><b>A：{{option.qPack.answerA}}</b> <img v-if="option.qPack.aFileName" :src=baseURL+option.qPack.aFileName /></span>
              <span class="mr-15" v-if="option.qPack.answerB"><b>B：{{option.qPack.answerB}}</b> <img v-if="option.qPack.bFileName" :src=baseURL+option.qPack.bFileName /></span>
              <span class="mr-15" v-if="option.qPack.answerC"><b>C：{{option.qPack.answerC}}</b> <img v-if="option.qPack.cFileName" :src=baseURL+option.qPack.cFileName /></span>
              <span class="mr-15" v-if="option.qPack.answerD"><b>D：{{option.qPack.answerD}}</b> <img v-if="option.qPack.dFileName" :src=baseURL+option.qPack.dFileName /></span>
              <span class="mr-15" v-if="option.qPack.answerE"><b>E：{{option.qPack.answerE}}</b> <img v-if="option.qPack.eFileName" :src=baseURL+option.qPack.eFileName /></span>
              <span class="mr-15" v-if="option.qPack.answerF"><b>F：{{option.qPack.answerF}}</b> <img v-if="option.qPack.fFileName" :src=baseURL+option.qPack.fFileName /></span>
            </p>
            <p>答案：{{option.qPack.answerTrue}}</p>
            <p>你的回答：{{option.userAnswer}}</p>
          </li>
        </div>
      </ul>
      <div class="goBack">
        <p class="p" @click="goBackFn">返回试卷</p>
      </div>
      



</div>
</template>

<script>
import { findtestResult} from "../api/api.js";
import { baseURL } from "../public/js/ipConfig";
export default {
  name: 'answer',
  data(){
    return {
      baseURL:baseURL.ip1+"/upload/",
      data:[]
    }
  },
  components: {},
  mounted(){
    if(!this.$route.params.testId){
      this.$router.push({name:'login'}) 
    }else{
      this.answeerFn();
    }
    
  },
  methods:{
    goBackFn(){
      this.$router.push({name:'chooseTest',params:{data:this.$route.params.testList,isFinishTest:1}})
    },
    async answeerFn(){
      try{
        let data = await this.$axios.post(
          findtestResult,
          this._qs.stringify({
            testId:this.$route.params.testId,
            userId:this.$route.params.userId
          })
        );
        this.data=data.data

      }catch (err){
         this.$toast.center('网络异常，请稍后再试');
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
  ul
    padding:15px;
    .item 
      padding:0 15px;
      margin-bottom: 8px;
      cursor: pointer;
      border: 1px solid #f1f1f1;
      font-size:.4rem;
      p
        font-size:.28rem;
        margin:8px 0;
        line-height:24px;
        img
          width:1rem;
          height:1rem;
          border-radius:6px;
  .goBack
    padding:0 15px 15px 15px;
    .p
      background-color:#4285f4;
      color:#fff;
      padding: 16px;
      cursor: pointer;
      border: 1px solid #f1f1f1;
      font-size:.4rem;
      display:flex;
      align-items:center;
      justify-content:center;


</style>