<template>
  <div class="footer">
    <van-tabbar v-model="active" route>
      <van-tabbar-item to="/practice">
        <span>Learning</span>
        <template #icon="props">
          <img :src="props.active ? icon1.active : icon1.inactive" />
        </template>
      </van-tabbar-item>
      <van-tabbar-item to="/">
        <span>Library</span>
        <template #icon="props">
          <img :src="props.active ? icon2.active : icon2.inactive" />
        </template>
      </van-tabbar-item>
      <van-tabbar-item icon="setting" to="/setting">Setting</van-tabbar-item>
    </van-tabbar>
  </div>
</template>
<script>
import { Tabbar, TabbarItem } from 'vant';
import bookImage from '../assets/book.svg';
import bookImageInactive from '../assets/book-inactive.svg';
import libraryImage from '../assets/library.svg';
import libraryImageInactive from '../assets/library-inactive.svg';

export default {
  name: 'Footer',
  components: {
    [Tabbar.name]: Tabbar,
    [TabbarItem.name]: TabbarItem,
  },
  data() {
    return {
      active: 0,
      icon1: {
        active: bookImage,
        inactive: bookImageInactive,
      },
      icon2: {
        active: libraryImage,
        inactive: libraryImageInactive,
      },
    };
  },
};
</script>
