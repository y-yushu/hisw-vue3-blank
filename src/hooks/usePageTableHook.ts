type PageTableOptions = {
  // 过滤请求参数
  filterQuery?: <Q>(query: Q) => (Q | Partial<Q>) & Record<string, any>
}

export const usePageTableHook = <Q extends Record<string, any>, T extends Record<string, any>>(
  API: ApiTabelFunction<Q, T>,
  query1: Q,
  option?: PageTableOptions
) => {
  console.log('🚀 ~ usePageTableHook ~ optino:', option)
  // 保存初始查询条件的副本
  const metaquery = { ...query1 }

  // 检索条件
  const query = reactive<Q>({ ...query1 })

  // 重置检索条件
  const handleReset = () => {
    // 重置数据
    Object.assign(query, metaquery)
    getList()
  }

  // 分页相关内容
  const pagination = reactive({
    page: 1,
    pageSize: 10,
    total: 0
  })

  // 分页切换
  const handlePageChange = (page: number) => {
    pagination.page = page
    getList()
  }

  // 分页大小切换
  const handlePageSizeChange = (pageSize: number) => {
    pagination.pageSize = pageSize
    pagination.page = 1
    getList()
  }

  // 中间表格
  const tableList = ref<T[]>([])
  // 获取列表
  const getList = () => {
    let data = toRaw(query).value
    // 过滤请求参数
    if (option?.filterQuery) data = option.filterQuery(query)
    // 发起请求
    API({
      params: {
        pageNum: pagination.page,
        pageSize: pagination.pageSize
      },
      data: data
    }).then(res => {
      if (res.code === 200) {
        tableList.value = res.rows
        pagination.total = res.total
      }
    })
  }
  // 首先查询一次
  getList()

  return {
    // 检索条件
    query,
    handleReset,
    // 列表
    tableList,
    getList,
    // 分页
    pagination,
    handlePageChange,
    handlePageSizeChange
  }
}
