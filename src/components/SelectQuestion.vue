<template>
  <div class="selectQuestion">
    <van-radio-group v-model="answers[index]"
                     v-for="(question, index) in questions"
                     :key="index"
                     v-show="index >= (currentPage - 1) * itemNumberPerPage
                            && index < currentPage * itemNumberPerPage"
                     :disabled="!isBeforeSubmit">
      <van-cell :value="(index + 1) + '. ' + question.question"
                v-bind:value-class="{ wrong: check(answers[index], question.answer),
                                   beforeSubmit: isBeforeSubmit }" />
      <van-radio :name="selection"
                  v-for="(content, selection) in question.selections"
                  :key="selection"
                  class="selection">{{ selection + '. ' + content }}</van-radio>
      <van-cell :value="'Correct answer: ' + question.answer"
                v-if="check(answers[index], question.answer) && !isBeforeSubmit" />
    </van-radio-group>
    <van-pagination v-model="currentPage"
                    prev-text="Prev"
                    next-text="Next"
                    :total-items="questions.length"
                    :items-per-page="itemNumberPerPage"
                    @change="backTop" />
    <van-button type="info" @click="submit"
                v-if="isBeforeSubmit">Submit</van-button>
    <van-button type="info" @click="retry"
                v-if="!isBeforeSubmit">Retry</van-button>
    <van-button type="info" @click="showResult"
                v-if="!isBeforeSubmit">Result</van-button>
  </div>
</template>

<script>
// @ is an alias to /src
import Vue from 'vue';
import {
  Button, CellGroup, Cell, RadioGroup, Radio, Dialog, Pagination,
} from 'vant';

Vue.use(Button);
Vue.use(CellGroup);
Vue.use(Cell);
Vue.use(RadioGroup);
Vue.use(Radio);
Vue.use(Dialog);
Vue.use(Pagination);

export default {
  name: 'SelectQuestion',
  props: {
    questions: Array,
  },
  data() {
    return {
      answers: Array(this.questions.length).fill(''),
      isBeforeSubmit: true,
      title: '',
      result: '',
      currentPage: 1,
      itemNumberPerPage: 5,
    };
  },
  methods: {
    check(userSelection, answer) {
      if (userSelection !== answer) {
        return true;
      }
      return false;
    },
    getResult() {
      const wrongAnswers = document.getElementsByClassName('wrong');
      const wrongAnswerNumber = wrongAnswers.length;
      const totalAnswerNumber = this.questions.length;
      const accuracy = 1 - wrongAnswerNumber / totalAnswerNumber;
      const resultContent = `Right: ${totalAnswerNumber - wrongAnswerNumber}, Wrong: ${wrongAnswerNumber}。`;
      if (accuracy < 0.6) {
        this.title = 'Not good';
      } else if (accuracy > 0.8) {
        this.title = 'Excellent';
      } else {
        this.title = 'Good';
      }

      let allWrongQuestionIndex = '';
      if (wrongAnswerNumber !== 0) {
        let wrongQuestionIndex = '';
        wrongAnswers.forEach((element) => {
          const questionTitle = element.firstElementChild.innerHTML;
          const questionIndex = questionTitle.substring(0, questionTitle.indexOf('.'));
          wrongQuestionIndex += `${questionIndex}, `;
        });
        allWrongQuestionIndex = `\nWrong questions：${wrongQuestionIndex.slice(0, -2)}。`;
      }

      this.result = resultContent + allWrongQuestionIndex;
    },
    showResult() {
      Dialog.alert({
        title: this.title,
        message: this.result,
      });
    },
    submit() {
      this.isBeforeSubmit = false;
      this.getResult();
      this.showResult();
    },
    retry() {
      this.isBeforeSubmit = true;
      this.currentPage = 1;
      this.answers = Array(this.questions.length).fill('');
      this.backTop();
    },
    backTop() {
      window.scroll(0, 0);
    },
  },
};
</script>
<style scoped>
.wrong{
  color: red;
}

.beforeSubmit {
  color: black;
}
.van-radio {
  padding: 10px 16px;
}
.van-radio-group {
  border-top: 1px solid #ebedf0;
  border-bottom: 1px solid #ebedf0;
}
.van-button {
  margin: 0 5px;
}
</style>
