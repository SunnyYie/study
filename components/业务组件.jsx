// 通用组件 + 业务逻辑/数据结构的组合。它们针对特定业务场景，通常内置了数据处理、格式校验、状态同步等业务强相关的逻辑。

const UserAccountInput = ({ value, onChange, ...restProps }) => {
  const [localValue, setLocalValue] = useState(value || '')

  // 核心业务逻辑：格式化和校验
  const handleChange = useCallback(
    e => {
      let rawValue = e.target.value

      // 1. 业务格式化：移除所有空格
      let formattedValue = rawValue.replace(/\s/g, '')

      // 2. 业务校验：长度限制
      if (formattedValue.length > MAX_LENGTH) {
        MessageUtil.warning(`账户ID最多只能输入 ${MAX_LENGTH} 位`)
        formattedValue = formattedValue.substring(0, MAX_LENGTH)
      }

      // 更新内部状态
      setLocalValue(formattedValue)

      // 3. 将格式化后的值（业务需要的值）传递给父组件
      if (onChange) {
        onChange(formattedValue)
      }
    },
    [onChange],
  )

  return (
    <Input
      placeholder={`请输入 ${MAX_LENGTH} 位以内账户ID`}
      value={localValue}
      onChange={handleChange}
      {...restProps}
    />
  )
}

export default UserAccountInput
