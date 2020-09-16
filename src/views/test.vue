<template>
  <div class="test">
    <h2 class="highTitle">调研测试</h2>
    <p class="p clearfix"> <span class="fr" v-if="$route.params.testTime">剩余时间：{{timeTest}}</span></p>
    <div class="test-content exam-box">
      <div class="mu-badge-container type">
        <!-- <p class="p" v-if="form.type==1"><em class="mu-badge">单选题</em><span>（第{{questionTypeCount1}}题/共{{questionType1.length}}题）</span></p>
        <p class="p" v-if="form.type==2"><em class="mu-badge">多选题</em><span>（第{{questionTypeCount2}}题/共{{questionType2.length}}题）</span></p>
        <p class="p" v-if="form.type==3"><em class="mu-badge">判断题</em><span>（第{{questionTypeCount3}}题/共{{questionType3.length}}题）</span></p> -->

        <p class="p" v-if="form.type==1"><em class="mu-badge">单选题</em><span>（第{{formIndex+1}}题/共{{forms.length}}题）</span></p>
        <p class="p" v-if="form.type==2"><em class="mu-badge">多选题</em><span>（第{{formIndex+1}}题/共{{forms.length}}题）</span></p>
        <p class="p" v-if="form.type==3"><em class="mu-badge">判断题</em><span>（第{{formIndex+1}}题/共{{forms.length}}题）</span></p>

      </div>
      <h3 class="title">{{ form.content }} <span class="ml-15">（{{form.questionBonus}}分）</span></h3>
      <!-- 选择题 -->
      <ul class="options">
        <div v-for="(option, index) in form.options" :key="option.option" >
          <li v-if="option.content" class="item" :class="{selected: isSelected(form, option.option)}" @click="doOption(option.option)"><span>{{option.option}}:{{ option.content }}</span> <img v-if="option.pic" :src="option.pic" /></li>
        </div>

      </ul>

      <div class="op clearfix">
        <!-- :disabled="formIndex === 0" -->
        <!-- <button class="btn fl" @click="prevForm" disabled=true >上一题</button> -->
        <button class="btn fl" @click="prevForm" :disabled="formIndex === 0">上一题</button>
        <button class="btn fl" @click="nextForm" :disabled="disabledFn">下一题</button>
        <button class="btn fr" @click="submit()" v-show="disabledFn2">交 卷</button>
      </div>
    </div>

  </div>
</template>

<script>
import { findUserTest,answer,showUserBonus} from "../api/api.js";
import { baseURL } from "../public/js/ipConfig";
export default {
  name: "test",
  data() {
    return {
      formIndex: 0,
      forms: [],
      form: {},
      answerArr:[],
      timeCount:null,
      timeTest:'',
      timer:null,
      questionTypeCount1:0,//单选
      questionTypeCount2:0,//多选
      questionTypeCount3:0,//判断
    };
  },
  mounted() {
    if( this.$route.params.testTime==null ){
      localStorage.setItem('timeCount',"null");
    }else{
      localStorage.setItem('timeCount',this.$route.params.testTime*60);
    }
    
    if(!this.$route.params.testId){
      this.getTestFn(localStorage.getItem('testId'),localStorage.getItem('userId'));//获取试卷信息
    }else{
      this.getTestFn(this.$route.params.testId,this.$route.params.id);//获取试卷信息
    }
    this.localStorageParamsFn();

    this.formIndex=Number(localStorage.getItem('formIndex'));

    if( localStorage.getItem('timeCount')!='null' ){
      this.timer=setInterval(()=>{
        let time= localStorage.getItem('timeCount') || this.$route.params.testTime*60 ;
        let m=this.secondToDate(time)
        this.timeTest=m;
        if(time<=0){
          clearInterval(this.timer);
          this.submit2()
        }else{
          time--;
          localStorage.setItem('timeCount',time);
        }
      },1000)
    }


    
  },
  computed: {
    questionType1() {
      let questionType1Arr=[];
      this.forms.filter((item) => {
        if (item.type==1) {
          questionType1Arr.push(item);
        }
      });
      return questionType1Arr;
    },
    questionType2() {
      let questionType2Arr=[];
      this.forms.filter((item) => {
        if (item.type==2) {
          questionType2Arr.push(item);
        }
      });
      return questionType2Arr;
    },
    questionType3() {
      let questionType3Arr=[];
      this.forms.filter((item) => {
        if (item.type==3) {
          questionType3Arr.push(item);
        }
      });
      return questionType3Arr;
    },
    disabledFn(){
       if(Array.isArray(this.form.userAnswer)){
         if(this.form.userAnswer.length==0){
           return true;
         }
       }else{
         return (this.form.userAnswer==null) || (this.formIndex === this.forms.length - 1)
       }
    },
    disabledFn2(){
      if( (this.formIndex==this.forms.length - 1) && this.forms[this.forms.length - 1].userAnswer!=null ){
        return true
      }else{
        return false
      }
    }
  },
  components: {},
  methods: {
    localStorageParamsFn(){
      if( !localStorage.getItem('testId') ){
        localStorage.setItem('testId',this.$route.params.testId);
      }
      if( !localStorage.getItem('userId') ){
        localStorage.setItem('userId',this.$route.params.id);
      }
      if( !localStorage.getItem('formIndex') ){
        localStorage.setItem('formIndex',this.formIndex);
      }
      if( !localStorage.getItem('timeCount') ){
        localStorage.setItem('timeCount',this.timeCount);
      }
    },
    secondToDate(result) { 
      var h = Math.floor(result / 3600) < 10 ? '0'+Math.floor(result / 3600) : Math.floor(result / 3600);
      var m = Math.floor((result / 60 % 60)) < 10 ? '0' + Math.floor((result / 60 % 60)) : Math.floor((result / 60 % 60));
      var s = Math.floor((result % 60)) < 10 ? '0' + Math.floor((result % 60)) : Math.floor((result % 60));
      return result = h + ":" + m + ":" + s;
    },

    async getTestFn(testId,userId){
      try{
        let data = await this.$axios.post(
          findUserTest,
          this._qs.stringify({
            testId:testId,
            userId:userId
          })
        );
        let res=data.data;

        res.forEach((item,index)=>{
          let obj={};
          obj.id=item.id;
          obj.type=item.qPack.questionType;
          obj.content=item.qPack.questionContent;
          obj.questionBonus=item.questionBonus;
          obj.userAnswer=null;
          obj.options=[];

          if(item.qPack.aFileName){
            obj.options[0]={
              option:"A",
              content:item.qPack.answerA,
              pic:baseURL.ip1+'/upload/'+item.qPack.aFileName,
            }
          }else{
            obj.options[0]={
              option:"A",
              content:item.qPack.answerA,
            }
          }
          
          if(item.qPack.bFileName){
            obj.options[1]={
              option:"B",
              content:item.qPack.answerB,
              pic:baseURL.ip1+'/upload/'+item.qPack.bFileName,
            }
          }else{
            obj.options[1]={
              option:"B",
              content:item.qPack.answerB
            }
          }
          

          if(item.qPack.cFileName){
            obj.options[2]={
              option:"C",
              content:item.qPack.answerC,
              pic:baseURL.ip1+'/upload/'+item.qPack.cFileName,
            }
          }else{
            obj.options[2]={
              option:"C",
              content:item.qPack.answerC
            }
          }

          if(item.qPack.dFileName){
            obj.options[3]={
              option:"D",
              content:item.qPack.answerD,
              pic:baseURL.ip1+'/upload/'+item.qPack.dFileName,
            }
          }else{
            obj.options[3]={
              option:"D",
              content:item.qPack.answerD
            }
          }

          if(item.qPack.eFileName){
            obj.options[4]={
              option:"E",
              content:item.qPack.answerE,
              pic:baseURL.ip1+'/upload/'+item.qPack.eFileName,
            }
          }else{
            obj.options[4]={
              option:"E",
              content:item.qPack.answerE
            }
          }


          if(item.qPack.fFileName){
            obj.options[5]={
              option:"F",
              content:item.qPack.answerF,
              pic:baseURL.ip1+'/upload/'+item.qPack.fFileName,
            }
          }else{
            obj.options[5]={
              option:"F",
              content:item.qPack.answerF
            }
          }
          
          this.forms.push(obj);
        })
        this.form = this.forms[this.formIndex];


        switch (this.form.type){
          case 1:
            if( localStorage.getItem('questionTypeCount1') ){
              this.questionTypeCount1=Number(localStorage.getItem('questionTypeCount1'));
            }else{
              this.questionTypeCount1++;
            }
            break; 
          case 2:
            if( localStorage.getItem('questionTypeCount2') ){
              this.questionTypeCount2=Number(localStorage.getItem('questionTypeCount2'));
            }else{
              this.questionTypeCount2++;
            }
            break; 
          case 3:
            if( localStorage.getItem('questionTypeCount3') ){
              this.questionTypeCount3=Number(localStorage.getItem('questionTypeCount3'));
            }else{
              this.questionTypeCount3++;
            }
            break; 
        }
      }catch (err){
         this.$toast.center('网络异常，请稍后再试');
      }
    },



    submit(){
      if( confirm("确定提交吗？") ){
        clearInterval(this.timer);
        let userAnswer
        if( Array.isArray(this.form.userAnswer) ){
            userAnswer =this.form.userAnswer.join(",").replace(/,/g, "");
        }else{
          userAnswer =this.form.userAnswer;
        }
          let id=this.form.id;

          this.$axios.post(answer,this._qs.stringify({userAnswer,id})).then(res=>{
            this.$axios.post(showUserBonus,this._qs.stringify({
              testId:this.$route.params.testId,
              userId:this.$route.params.id
            })).then(res=>{
              this.$router.push({name:'result',params: {score:res.data,testId:this.$route.params.testId,userId:this.$route.params.id,testPassBonus:this.$route.params.testPassBonus,testList:this.$route.params.testList}}) 
            })
          })



      }

    },

    submit2(){
   
        clearInterval(this.timer);
        let userAnswer
        if( Array.isArray(this.form.userAnswer) ){
            userAnswer =this.form.userAnswer.join(",").replace(/,/g, "");
        }else{
          userAnswer =this.form.userAnswer;
        }
          let id=this.form.id;

          this.$axios.post(answer,this._qs.stringify({userAnswer,id})).then(res=>{
            this.$axios.post(showUserBonus,this._qs.stringify({
              testId:this.$route.params.testId,
              userId:this.$route.params.id
            })).then(res=>{
              this.$router.push({name:'result',params: {score:res.data,testId:this.$route.params.testId,userId:this.$route.params.id}}) 
            })
          })

    },

    prevForm(){

      this.formIndex--;
      this.form = this.forms[this.formIndex]
      localStorage.setItem('formIndex',this.formIndex);
      switch (this.form.type){
        case 1:
          if(this.questionTypeCount1==0){
            this.questionTypeCount1++
          }else{
            this.questionTypeCount1--;
          }
          localStorage.setItem('questionTypeCount1',this.questionTypeCount1);
          break; 
        case 2:
          if(this.questionTypeCount2==0){
            this.questionTypeCount2++
          }else{
            this.questionTypeCount2--;
          }
          localStorage.setItem('questionTypeCount2',this.questionTypeCount2);
          break; 
        case 3:
          if(this.questionTypeCount3==0){
            this.questionTypeCount3++
          }else{
            this.questionTypeCount3--;
          }
          localStorage.setItem('questionTypeCount3',this.questionTypeCount3);
          break; 
      }


    },
    async nextForm() {
      let userAnswer
       if( Array.isArray(this.form.userAnswer) ){
          userAnswer =this.form.userAnswer.join(",").replace(/,/g, "");
       }else{
         userAnswer =this.form.userAnswer;
       }
        let id=this.form.id;
        let data = await this.$axios.post(
          answer,
          this._qs.stringify({
            userAnswer,
            id
          })
        );
        if(data.status !=0){
          this.$toast.center('内部错误，请重新再试');
          this.$router.push({name:'login'}) 
        }
        this.formIndex++;
        this.form = this.forms[this.formIndex];
        localStorage.setItem('formIndex',this.formIndex);
        switch (this.form.type){
          case 1:
            if(this.questionTypeCount1==this.questionType1.length){
              this.questionTypeCount1==this.questionType1.length;
            }else{
              this.questionTypeCount1++;
            }
            localStorage.setItem('questionTypeCount1',this.questionTypeCount1);
            break; 
          case 2:
            if(this.questionTypeCount2==this.questionType2.length){
              this.questionTypeCount2==this.questionType2.length;
            }else{
              this.questionTypeCount2++;
            }
            localStorage.setItem('questionTypeCount2',this.questionTypeCount2);
            break; 
          case 3:
            if(this.questionTypeCount3==this.questionType3.length){
              this.questionTypeCount3==this.questionType3.length;
            }else{
              this.questionTypeCount3++;
            }
            localStorage.setItem('questionTypeCount3',this.questionTypeCount3);
            break; 
        }

        
    },
    isSelected(form, index) {
      if (form.type === 1 ) {
        return form.userAnswer === index;
      }else if ( form.type === 3) {
        return form.userAnswer === index;
      } else if (form.type === 2) {
        if (!form.userAnswer) {
          return false;
        }
        for (let answer of form.userAnswer) {
          if (answer === index) {
            return true;
          }
        }
        return false;
      }
      return false;
    },

    doOption(index) {

        if (this.form.type === 1) {
            this.form.userAnswer = index
        }else if (this.form.type === 3) {
            this.form.userAnswer = index
        }  else if (this.form.type ===2) {

            let userAnswer = this.form.userAnswer;
            if (!userAnswer) {
                userAnswer = []
            }

            if (userAnswer.indexOf(index) ==-1 ) {
              userAnswer.push(index);
            }else{
              for (let i = 0; i < userAnswer.length; i++) {
                  if (userAnswer[i] === index) {
                      userAnswer.splice(i, 1)
                      return
                  }
              }
            }

            userAnswer = userAnswer.sort();
            this.form.userAnswer = userAnswer

        }
    },


  },
  watch:{
  }
};
</script>

<style lang="stylus" scoped>
.test 
  margin: 0 auto;
  padding: 16px;
  .highTitle
    padding:15px;
    font-size:.4rem;
    background:green;
    color:#fff;
    letter-spacing:2px;
  .p
    color:#999;
    font-size:12px;
    margin:15px 0;
  .exam-box 
    padding:0px 16px 16px;
    margin-bottom: 24px;
    box-shadow: 0 1px 6px rgba(0, 0, 0, 0.117647), 0 1px 4px rgba(0, 0, 0, 0.117647);
    .mu-badge-container 
      display: inline-block;
      position: relative;
      margin-bottom: 16px;
      .p
        display: flex;
        justify-content: center;
        align-items: center; 
        .mu-badge 
          padding: 0 6px;
          line-height: 1.5;
          font-size: 12px;
          font-style: normal;
          background-color: #bdbdbd;
          color: #fff;
          border-radius: 3px;
          overflow: hidden;
    .title
      font-size:.36rem;
      font-weight:700;
      margin-bottom: 16px;
      line-height:22px;
    ul 
      .item 
        padding: 16px;
        margin-bottom: 8px;
        cursor: pointer;
        border: 1px solid #f1f1f1;
        font-size:.3rem;
        display:flex;
        align-items:center;
        justify-content:center;
        span 
          flex:1;
        img 
          width:1rem;
          height:1rem;
          border-radius:6px;
      .selected
        border: 1px solid #55a532;
        background-color: #f1f1f1;
    .op
      .btn
        font-size:.28rem;
        margin-right: 8px;
        padding:4px 8px;
        border:none;
        outline: 0;
        background-color:#009688;
        color:#fff;
      .btn[disabled]
        background-color: #ccc;
        
</style>