export default function usePermission() {
  const hasPermission = (permission) => {
    // 这里可以根据实际需求实现权限检查逻辑
    const userPermissions = ['read', 'write'] // 示例用户权限
    return userPermissions.includes(permission)
  }

  return { hasPermission }
  }