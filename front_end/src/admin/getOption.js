import moment from 'moment';

export const getSnippetOption = (snippetData) => {
  const year = new Date().getFullYear();
  function getVirtulData(year) {
    let data ={};
    snippetData.forEach(v => {
      const dataYear = moment(parseInt(v.time, 0)).year();
      const date = moment(parseInt(v.time, 0)).format('YYYY-MM-DD');
      if (dataYear === year) {
        if (data[date]) {
          data[date]= [date, data[date][1] + 1]; 
        }
        data[date] = [date, 1];
      }
    })
    data = Object.keys(data).map(v => data[v]);
    return data;
  }
  return {
    title: {
      top: 30,
      left: 'center',
      text: new Date().getFullYear() + '年添加代码数'
    },
    tooltip: {
      formatter: function (p) {
        return `日期: ${p.data[0]}<br/>数量: ${p.data[1]}`;
      }
    },
    visualMap: {
        min: 0,
        max: 100,
        type: 'piecewise',
        orient: 'horizontal',
        left: 'center',
        top: 65,
        textStyle: {
            color: '#000'
        }
    },
    calendar: {
        top: 120,
        left: 30,
        right: 30,
        cellSize: ['auto', 13],
        range: year,
        itemStyle: {
            borderWidth: 0.5
        },
        yearLabel: {show: false}
    },
    series: {
        type: 'heatmap',
        coordinateSystem: 'calendar',
        data: getVirtulData(year)
    }
  };
}

export const getScreenShotOption = (screenshots) => {
  let data = {};
  screenshots.forEach(v => {
    const { historyId } = v;
    data[historyId] = data[historyId] ? data[historyId] + 1 : 1;
  });
  data = Object.keys(data).map(v => ({
    name: v,
    value: data[v],
  }))
  return {
    title: {
        left: 'center',
        text: '运行测试屏幕截图数量占比',
    },
    tooltip: {
        formatter: function (info) {
          const { name, value } = info.data;
            return [
                '所属历史记录ID: &nbsp;&nbsp;' + name + '<br>',
                '运行截图个数: &nbsp;&nbsp;' + value
            ].join('');
        }
    },
    series: [{
        name: 'ALL',
        top: 80,
        type: 'treemap',
        label: {
            show: true,
            formatter: "{b}",
            normal: {
                textStyle: {
                    ellipsis: true
                }
            }
        },
        itemStyle: {
            normal: {
                borderColor: 'black'
            }
        },
        levels: [
            {
              color: [
                '#c23531', '#314656', '#61a0a8', '#dd8668',
                '#91c7ae', '#6e7074', '#61a0a8', '#bda29a',
                '#44525d', '#c4ccd3'
              ],
              colorMappingBy: 'value',
                itemStyle: {
                    borderWidth: 1,
                    borderColor: '#333',
                    gapWidth: 1
                }
            }
        ],
        data
    }]
  };
}

export const getConsumIdOption = consums => {
  let data = {
    seriesData: [],
    selected: {},
    legendData: [],
  };
  const newData = {};

  consums.forEach(v => {
    newData[v.historyId] = newData[v.historyId] ? newData[v.historyId] + 1 : 1;
  });
  Object.keys(newData).forEach(v => {
    data.legendData.push(v);
    data.selected[v] = true;
    data.seriesData.push({
      name: v,
      value: newData[v]
    });
  });

  return {
    title: {
      text: '运行记录请求占比',
      left: 'center'
    },
    tooltip: {
      trigger: 'item',
      formatter: '{a} <br/> id: {b} <br/> 请求数: {c} <br/> 占比: ({d}%)'
    },
    legend: {
      type: 'scroll',
      orient: 'vertical',
      right: 10,
      top: 20,
      bottom: 20,
      data: data.legendData,
      selected: data.selected
    },
    series: [
      {
        name: '请求占比',
        type: 'pie',
        radius: '55%',
        center: ['50%', '50%'],
        data: data.seriesData,
        emphasis: {
          itemStyle: {
            shadowBlur: 10,
            shadowOffsetX: 0,
            shadowColor: 'rgba(0, 0, 0, 0.5)'
          }
        }
      }
    ]
  }
}

export const getConsumStatusOption = consums => {
  let data = {
    seriesData: [],
    selected: {},
    legendData: [],
  };
  const newData = {};

  consums.forEach(v => {
    newData[v.status] = newData[v.status] ? newData[v.status] + 1 : 1;
  });
  Object.keys(newData).forEach(v => {
    data.legendData.push(v);
    data.selected[v] = true;
    data.seriesData.push({
      name: v,
      value: newData[v]
    });
  });

  return {
    title: {
      text: '运行记录请求占比',
      left: 'center'
    },
    tooltip: {
      trigger: 'item',
      formatter: '{a} <br/> id: {b} <br/> 请求数: {c} <br/> 占比: ({d}%)'
    },
    legend: {
      type: 'scroll',
      orient: 'vertical',
      right: 10,
      top: 20,
      bottom: 20,
      data: data.legendData,
      selected: data.selected
    },
    series: [
      {
        name: '请求占比',
        type: 'pie',
        radius: '55%',
        center: ['50%', '50%'],
        data: data.seriesData,
        emphasis: {
          itemStyle: {
            shadowBlur: 10,
            shadowOffsetX: 0,
            shadowColor: 'rgba(0, 0, 0, 0.5)'
          }
        }
      }
    ]
  }
}
