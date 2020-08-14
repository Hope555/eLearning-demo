<template>
  <div class="selectQuestion">
    <van-cell-group v-for="(question, index) in questions"
                    :key="index"
                    v-show="index >= (currentPage - 1) * itemNumberPerPage
                            && index < currentPage * itemNumberPerPage">
      <van-cell :value="(index + 1) + '. ' + question.question"
                v-bind:value-class="{ wrong: check(answers[index], question.answer),
                                      beforeSubmit: isBeforeSubmit }" />
      <van-field v-model="answers[index]" label="Answer" placeholder="Please input answer..."
                :readonly="!isBeforeSubmit" />
      <van-cell :value="'Correct answer: ' + question.answer"
                v-if="check(answers[index], question.answer) && !isBeforeSubmit" />
    </van-cell-group>
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
  Button, CellGroup, Cell, Field, Dialog, Pagination,
} from 'vant';

Vue.use(Button);
Vue.use(CellGroup);
Vue.use(Cell);
Vue.use(Field);
Vue.use(Dialog);
Vue.use(Pagination);

export default {
  name: 'InputQuestion',
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
    check(userInput, answer) {
      if (userInput !== answer) {
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
.van-button {
  margin: 0 5px;
}
</style>
