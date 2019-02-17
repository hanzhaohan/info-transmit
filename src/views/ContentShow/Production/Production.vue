<template>
  <div class="product-box">
    <PList @tabSwitch="tabSwitch"/> 
  </div>
</template>

<script>
import PList from '../../../components/PList/PList'
import {TAB_SWITCH, TAB_SWITCH_PR} from '../../../store/mutation-types'
// import { mapState } from 'vuex';
export default {
  data() {
    return {};
  },
  components: {
    PList
  },
  computed: {},
  mounted() {
    this.$store.commit(TAB_SWITCH, 3);

    let formdata = new FormData();
    formdata.append('action', 'ReceivePrClassify');
    formdata.append('userCode', localStorage.getItem("UserCode"));
    this.$store.dispatch('receivePrClassify', formdata).then(data => {
      localStorage.setItem('prClassify', JSON.stringify(data));
    })
  },
  methods: {
    tabSwitch(data) {
      this.$store.commit(TAB_SWITCH_PR, data);
      this.$router.push({
        path: '/productlist',
        query: {
          id: data
        }
      });
    }
  }
};
</script>

<style lang="less" rel="stylesheet/less" scoped>
.product-box {
  margin-top: 50px;
  display: flex;
  justify-content: center;
}
</style>