<template>
  <div class="libraryBook">
    <van-collapse v-model="activeNames">
      <van-collapse-item :title="category"
                         :name="(index + 1).toString()"
                         v-for="(books, category, index) in libraryBooks"
                         :key="index">
        <van-card
          v-for="book in books"
          :key="book.id"
          :title="book.subject"
          :desc="'Grade ' + book.grade"
          centered
          @click="selectBook(book.id, book.subject + '-Grade ' + book.grade)"
        >
          <template #thumb>
            <van-image
              width="88px"
              height="88px"
              fit="contain"
              :src="imgUrlPrefix + book.id + '.jpg'"
            >
              <template v-slot:loading>
                <van-loading color="#1989fa" />
              </template>
            </van-image>
          </template>
          <template #footer>
            <van-icon name="arrow" class="custom-icon" />
          </template>
        </van-card>
      </van-collapse-item>
    </van-collapse>
  </div>
</template>

<script>
// @ is an alias to /src
import Vue from 'vue';
import {
  Collapse, CollapseItem, Card, Icon, Image,
} from 'vant';

Vue.use(Collapse);
Vue.use(CollapseItem);
Vue.use(Card);
Vue.use(Icon);
Vue.use(Image);

export default {
  name: 'LibraryBook',
  props: {
    libraryBooks: Object,
  },
  data() {
    return {
      activeNames: ['1'],
      imgUrlPrefix: 'https://s3.ap-east-1.amazonaws.com/kute.demo/img/',
    };
  },
  methods: {
    selectBook(bookId, bookName) {
      if (bookId !== this.$store.state.selectBookId) {
        this.disableKeepAlive();
        this.$store.commit('updateSelectBookId', bookId);
        this.$store.commit('updateSelectBookName', bookName);
      }
      this.$router.push({
        path: '/practice',
      });
    },
    disableKeepAlive() {
      this.$store.commit('updateUnKeepAliveComponent', 'Practice');
    },
  },
};
</script>

<style scoped>
.van-collapse-item {
  text-align: left;
}
.custom-icon {
  position: absolute;
  right: 16px;
  top: 50%;
  -ms-transform: translateY(-50%);
  transform: translateY(-50%);
  color: #969799;
  font-size: x-large;
}
</style>
