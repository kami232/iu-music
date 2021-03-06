import {playMode} from 'static/js/config';

const state = {
  token: localStorage.getItem("token"),
  userInfo: {
    id: 0,
    avatar: '',
    username: '',
    phone: '',
    buyId: null,
    likeId: null
  }, // 用户信息
  recordDetail: {}, // 专辑或歌单详情
  isPlay: false, // 是否处于播放
  fullPlayer: false, // 是否处于全屏播放器
  playlist: [], // 播放列表
  // loopList: [],
  mode: playMode.sequence, // 当前播放模式
  currentIndex: -1, // 播放歌曲索引
};

export default state;