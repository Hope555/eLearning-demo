<template>
  <div class="practice">
    <van-nav-bar :title="bookName">
      <template #left>
        <van-button v-show="bookId"
                    :loading="isLoadingTitle"
                    type="info"
                    class="fixWidth"
                    @click="togglePopup">
          Menu
        </van-button>
      </template>
    </van-nav-bar>
    <van-popup v-model='isPopupShow'
               closeable
               position="left"
               :style='{ height: "100%", textAlign: "left" }'>
      <van-cell-group>
        <van-cell value='Menu' />
        <van-cell v-bind:class="{ bold: !title.is_sub_title,
                                  selectColor: (title.title === currentQuestionTitle),
                                  gray: !title.available && title.is_sub_title }"
                  v-for='title in titles'
                  :key='title.id'
                  :title= "title.title"
                  :is-link="!!title.is_sub_title"
                  @click="title.is_sub_title
                          && showQuestions(title.id, title.title, title.available)" />
      </van-cell-group>
    </van-popup>
    <!-- no book select -->
    <h3 v-if="!bookId">Please select a book.</h3>
    <van-button v-if="!bookId" type="info" to="/">Select</van-button>
    <!-- load title -->
    <van-loading v-if="bookId && isLoadingTitle" color="#1989fa" size="50px" vertical>
      Coming soon...
    </van-loading>
    <h3 v-if="bookId && !isLoadingTitle && !isStartPractice">Ready</h3>
    <van-button v-if="bookId && !isLoadingTitle && !isStartPractice"
                type="info" @click="togglePopup">
      Start
    </van-button>
    <!-- load question -->
    <van-loading v-if="isLoadingQuestion" color="#1989fa" size="50px" />
    <van-cell class="bold" v-if="!isLoadingQuestion" :value='currentQuestionTitle' />
    <SelectQuestion v-if="!isLoadingQuestion && questions.length && questions[0].selections"
                    v-bind:questions="questions"></SelectQuestion>
    <InputQuestion v-else-if="!isLoadingQuestion && questions.length && !questions[0].selections"
                   v-bind:questions="questions"></InputQuestion>
  </div>
</template>

<script>
import Vue from 'vue';
import axios from 'axios';
import {
  Popup, Button, CellGroup, Cell, NavBar, Loading, Toast,
} from 'vant';
import SelectQuestion from '@/components/SelectQuestion.vue';
import InputQuestion from '@/components/InputQuestion.vue';

Vue.use(Popup);
Vue.use(Button);
Vue.use(CellGroup);
Vue.use(Cell);
Vue.use(NavBar);
Vue.use(Loading);
Vue.use(Toast);

const titles = [
  {
    id: 10,
    is_sub_title: 1,
    title: 'Compare',
    available: 1,
  },
  {
    id: 11,
    is_sub_title: 1,
    title: 'Calculate',
    available: 1,
  },
];

export default {
  name: 'Practice',
  components: {
    SelectQuestion,
    InputQuestion,
  },
  data() {
    return {
      currentQuestionTitle: '',
      titles,
      rawQuestions: [],
      bookId: this.$store.state.selectBookId,
      bookName: this.$store.state.selectBookName,
      isPopupShow: false,
      isLoadingTitle: true,
      isStartPractice: false,
      isLoadingQuestion: false,
    };
  },
  mounted() {
    if (this.bookId !== 0) {
      // axios
      //   .get(`https://ww4dlncx61.execute-api.ap-northeast-1.amazonaws.com/prod/loadMenu?book_id=${this.bookId}`)
      //   .then((response) => {
      //     this.titles = response.data;
      //     this.isLoadingTitle = false;
      //     this.enableKeepAlive();
      //   });
      this.isLoadingTitle = false;
      this.enableKeepAlive();
    }
  },
  methods: {
    togglePopup() {
      this.isPopupShow = !this.isPopupShow;
    },
    showQuestions(titleId, title, available) {
      if (available) {
        this.isStartPractice = true;
        this.togglePopup();
        if (this.currentQuestionTitle !== title) {
          this.currentQuestionTitle = title;
          this.isLoadingQuestion = true;
          axios
            .get(`https://ww4dlncx61.execute-api.ap-northeast-1.amazonaws.com/prod/loadMenu?title_id=${titleId}`)
            .then((response) => {
              this.rawQuestions = response.data;
              this.isLoadingQuestion = false;
            });
        }
      } else {
        Toast('Sorry, this episode is not ready, please select the episodes with black color.');
      }
    },
    addSpace(noSpaceString) {
      const separators = ['+', '-', '(', ')', '*', '/', ':', '?', '='];
      let spaceString = noSpaceString;
      separators.forEach((element) => {
        spaceString = spaceString.replace(element, ` ${element} `);
      });
      return spaceString;
    },
    enableKeepAlive() {
      this.$store.commit('updateUnKeepAliveComponent', '');
    },
  },
  computed: {
    questions() {
      const unformatQuestions = this.rawQuestions;
      if (unformatQuestions.length > 0 && unformatQuestions[0].question.includes('@@')) {
        const formatQuestions = [];
        const alphabet = 'abcdefghijk'.split('');
        for (let i = 0; i < unformatQuestions.length; i += 1) {
          const splitIndex = unformatQuestions[i].question.indexOf('@@');
          const noSpaceQuestion = unformatQuestions[i].question.substring(0, splitIndex);
          const questionValue = this.addSpace(noSpaceQuestion);
          const selectionArray = unformatQuestions[i].question.substring(splitIndex + 2).split('@');
          let selectionValue = {};
          const answerValue = unformatQuestions[i].answer;
          let questionObj = {};
          for (let j = 0; j < selectionArray.length; j += 1) {
            selectionValue = Object.assign(selectionValue, { [alphabet[j]]: selectionArray[j] });
          }
          questionObj = {
            question: questionValue,
            selections: selectionValue,
            answer: answerValue,
          };
          formatQuestions.push(questionObj);
        }
        return formatQuestions;
      }
      for (let i = 0; i < unformatQuestions.length; i += 1) {
        unformatQuestions[i].question = this.addSpace(unformatQuestions[i].question);
      }
      return unformatQuestions;
    },
  },
};
</script>

<!-- Add 'scoped' attribute to limit CSS to this component only -->
<style scoped>
h1, h2 {
  font-weight: normal;
}
ul {
  list-style-type: none;
  padding: 0;
}
li {
  display: inline-block;
  margin: 0 10px;
}
a {
  color: #42b983;
}
.bold {
  font-weight: bold;
}
.van-loading, h3 {
  margin-top: 30%;
}
.fixWidth {
  width: 4rem;
}
.selectColor {
  color: #1989fa;
}
.gray {
  color: #969799;
}
</style>
