<template>
  <div>
    <van-nav-bar
      title="Library"
    />
    <van-loading v-if="isLoadingBook" color="#1989fa" size="50px" />
    <LibraryBook v-else v-bind:libraryBooks="libraryBooks"></LibraryBook>
  </div>
</template>

<script>
import Vue from 'vue';
import axios from 'axios';
import {
  NavBar, Loading,
} from 'vant';
import LibraryBook from '@/components/LibraryBook.vue';

Vue.use(axios);
Vue.use(NavBar);
Vue.use(Loading);

const libraryBooks = {
  Math: [
    {
      id: 1,
      name: '口算题卡',
      grade: 1,
      subject: 'Math',
      edition: '人教',
    },
  ],
};

export default {
  name: 'Library',
  components: {
    LibraryBook,
  },
  data() {
    return {
      // rawBooks: [],
      libraryBooks,
      isLoadingBook: false,
    };
  },
  // mounted() {
  //   this.isLoadingBook = true;
  //   axios
  //     .get('https://ww4dlncx61.execute-api.ap-northeast-1.amazonaws.com/prod/loadMenu?book_name=1')
  //     .then((response) => {
  //       this.rawBooks = response.data;
  //       this.isLoadingBook = false;
  //     });
  // },
  // computed: {
  //   libraryBooks() {
  //     const classifiedBooks = {};
  //     this.rawBooks.forEach((book) => {
  //       classifiedBooks[book.name] = classifiedBooks[book.name] || [];
  //       classifiedBooks[book.name].push(book);
  //     });
  //     return classifiedBooks;
  //   },
  // },
};
</script>

<style scoped>
.van-collapse {
  text-align: left;
}
.van-loading {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
}
</style>
