/**
 * 分页表格数据管理 Hook：usePageTableHook
 *
 * 用于管理表格数据的检索、分页、选择和数据加载，提供完整的表格数据管理解决方案。
 * 通过封装常见的表格操作逻辑，简化组件中的代码，实现数据与UI的解耦。
 *
 * 功能：
 * - 管理表格查询条件，支持重置和自定义过滤。
 * - 处理分页逻辑，包括页码切换和每页显示数量调整。
 * - 管理表格数据加载，自动调用API获取数据。
 * - 提供行选择功能，支持单选和多选。
 * - 响应式数据结构，所有状态变更自动触发UI更新。
 *
 * 泛型参数：
 * - Q: 查询条件类型，必须是一个对象类型。
 * - T: 表格数据项类型，必须是一个对象类型。
 *
 * 参数说明：
 * - API: 用于获取表格数据的API函数，接收查询参数并返回数据列表。
 * - query1: 初始查询条件，会被保存并用于重置功能。
 * - option: 可选配置项，包含自定义过滤查询参数的函数。
 *
 * 返回值：
 * - query: 响应式的查询条件对象，可直接绑定到表单。
 * - handleReset: 重置查询条件并刷新数据的函数。
 * - tableList: 响应式的表格数据数组。
 * - getList: 手动触发数据加载的函数。
 * - singleCheckedRow: 当前单选选中的行数据。
 * - checkedRowKeys: 当前多选选中的行ID数组。
 * - handleCheck: 处理行选择变化的函数。
 * - pagination: 分页配置对象，包含页码、每页数量和总条数。
 * - handlePageChange: 处理页码变化的函数。
 * - handlePageSizeChange: 处理每页显示数量变化的函数。
 *
 * 使用方法：
 * 1. 在组件中引入 usePageTableHook。
 * 2. 定义查询条件类型和表格数据项类型。
 * 3. 调用 usePageTableHook 传入API函数和初始查询条件。
 * 4. 解构返回值，在模板中使用相关属性和方法。
 *
 * 示例：
 * ```
 * const {
 *   query, handleReset, tableList, getList,
 *   pagination, handlePageChange, handlePageSizeChange,
 *   singleCheckedRow, checkedRowKeys, handleCheck
 * } = usePageTableHook<QueryType, TableItemType>(getDataAPI, {
 *   name: '',
 *   status: ''
 * })
 * ```
 *
 * 注意事项：
 * - API函数需要符合特定的参数和返回值格式。
 * - 初始化时会自动调用一次API获取数据。
 * - 查询条件变更不会自动触发数据刷新，需要手动调用getList。
 * - 分页切换会自动触发数据刷新。
 */
type PageTableOptions = {
  // 过滤请求参数
  filterQuery?: <Q>(query: Q) => (Q | Partial<Q>) & Record<string, any>
}

export const usePageTableHook = <Q extends Record<string, any>, T extends Record<string, any>>(
  API: ApiTabelFunction<Q, T>,
  query1: Q,
  option?: PageTableOptions
) => {
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
  getList()

  // 选中行管理
  const singleCheckedRow = ref<T | null>(null) // 单选的key
  const checkedRowKeys = ref<(string | number)[]>([]) // 多选的keys
  // 行选择处理
  const handleCheck = (rowKeys: (string | number)[], rows: any[]) => {
    singleCheckedRow.value = rows.length === 1 ? (rows[0] as T) : null
    checkedRowKeys.value = rowKeys
  }

  return {
    // 检索条件
    query,
    handleReset,
    // 列表
    tableList,
    getList,
    singleCheckedRow, // 单选的key
    checkedRowKeys, // 多选的keys
    handleCheck, // 行选择处理
    // 分页
    pagination,
    handlePageChange, // 分页切换
    handlePageSizeChange // 分页大小切换
  }
}
