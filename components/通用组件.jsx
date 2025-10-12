// 最大限度地复用，它们只关注 UI 展示和基础交互逻辑，不涉及任何具体的业务逻辑或数据流。

const BaseModal = ({ title, visible, confirmLoading, onOk, onCancel, children, ...restProps }) => {
  return (
    <Modal
      title={title}
      visible={visible}
      onOk={onOk}
      onCancel={onCancel}
      confirmLoading={confirmLoading}
      // 允许传入 Antd Modal 的所有其他属性
      {...restProps}
    >
      {children}
    </Modal>
  )
}

BaseModal.propTypes = {
  title: PropTypes.string.isRequired,
  visible: PropTypes.bool.isRequired,
  confirmLoading: PropTypes.bool,
  onOk: PropTypes.func.isRequired,
  onCancel: PropTypes.func.isRequired,
  children: PropTypes.node,
  // ... 其他 Antd Modal props
}

BaseModal.defaultProps = {
  confirmLoading: false,
}

const MessageUtil = {
  success: (content, duration = DURATION_SHORT) => {
    message.success({
      content,
      duration,
      className: 'app-message-success', // 可添加全局样式类
    })
  },
  error: (content, duration = DURATION_SHORT) => {
    message.error({
      content,
      duration: duration * 1.5, // 错误消息显示时间稍长
      className: 'app-message-error',
    })
  },
  warning: (content, duration = DURATION_SHORT) => {
    message.warning({
      content,
      duration,
    })
  },
}

export default MessageUtil
