/**
 * 北大熊猫老师 2026年北京中考一模成绩数据
 * 数学满分100分，物理满分80分
 * 海淀区20名学员 + 西城区4名学员
 */

var DEFAULT_STUDENTS = [
  // ===== 海淀区 20名学员 =====
  { id: 'hd01', name: '张*轩', district: '海淀区', school: '人大附中',       grade: '初三', math: 97, physics: 78 },
  { id: 'hd02', name: '李*涵', district: '海淀区', school: '北大附中',       grade: '初三', math: 96, physics: 76 },
  { id: 'hd03', name: '王*博', district: '海淀区', school: '清华附中',       grade: '初三', math: 95, physics: 77 },
  { id: 'hd04', name: '赵*宇', district: '海淀区', school: '101中学',        grade: '初三', math: 95, physics: 74 },
  { id: 'hd05', name: '陈*琪', district: '海淀区', school: '十一学校',       grade: '初三', math: 94, physics: 75 },
  { id: 'hd06', name: '刘*萱', district: '海淀区', school: '人大附中',       grade: '初三', math: 93, physics: 73 },
  { id: 'hd07', name: '孙*泽', district: '海淀区', school: '首师大附中',     grade: '初三', math: 92, physics: 76 },
  { id: 'hd08', name: '周*然', district: '海淀区', school: '北大附中',       grade: '初三', math: 92, physics: 72 },
  { id: 'hd09', name: '吴*晗', district: '海淀区', school: '清华附中',       grade: '初三', math: 91, physics: 74 },
  { id: 'hd10', name: '郑*远', district: '海淀区', school: '人大附中',       grade: '初三', math: 90, physics: 71 },
  { id: 'hd11', name: '马*珊', district: '海淀区', school: '十一学校',       grade: '初三', math: 89, physics: 73 },
  { id: 'hd12', name: '杨*飞', district: '海淀区', school: '101中学',        grade: '初三', math: 89, physics: 70 },
  { id: 'hd13', name: '黄*杰', district: '海淀区', school: '北大附中',       grade: '初三', math: 88, physics: 72 },
  { id: 'hd14', name: '林*婷', district: '海淀区', school: '清华附中',       grade: '初三', math: 87, physics: 69 },
  { id: 'hd15', name: '徐*鹏', district: '海淀区', school: '首师大附中',     grade: '初三', math: 86, physics: 68 },
  { id: 'hd16', name: '何*妍', district: '海淀区', school: '人大附中',       grade: '初三', math: 85, physics: 71 },
  { id: 'hd17', name: '罗*阳', district: '海淀区', school: '十一学校',       grade: '初三', math: 84, physics: 67 },
  { id: 'hd18', name: '高*怡', district: '海淀区', school: '101中学',        grade: '初三', math: 83, physics: 66 },
  { id: 'hd19', name: '谢*辰', district: '海淀区', school: '北大附中',       grade: '初三', math: 82, physics: 65 },
  { id: 'hd20', name: '梁*旭', district: '海淀区', school: '清华附中',       grade: '初三', math: 80, physics: 64 },

  // ===== 西城区 4名学员（西城五金刚） =====
  { id: 'xc01', name: '韩*霖', district: '西城区', school: '北京四中',       grade: '初三', math: 96, physics: 77 },
  { id: 'xc02', name: '唐*瑶', district: '西城区', school: '北师大附属实验中学', grade: '初三', math: 93, physics: 75 },
  { id: 'xc03', name: '曹*豪', district: '西城区', school: '北京八中',       grade: '初三', math: 89, physics: 73 },
  { id: 'xc04', name: '邓*雪', district: '西城区', school: '三帆中学',       grade: '初三', math: 88, physics: 70 },
];

var DISTRICT_MAP = {
  '海淀区': 'haidian',
  '西城区': 'xicheng',
  '东城区': 'dongcheng',
  '朝阳区': 'chaoyang',
  '丰台区': 'fengtai',
};
