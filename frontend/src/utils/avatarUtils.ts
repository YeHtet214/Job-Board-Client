/**
 * Utility functions for avatar-related operations
 */

export const getInitials = (name: string): string => {
  if (!name || typeof name !== 'string') return '??'
  
  const parts = name.trim().split(/\s+/)
  
  if (parts.length === 0) return '??'
  if (parts.length === 1) return parts[0].substring(0, 2).toUpperCase()
  
  // Take first letter of first word and first letter of last word
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase()
}

export const getUserAvatarInitials = (
  firstName: string | undefined,
  lastName: string | undefined,
  recipientName: string | undefined,
  recipientId: string | undefined,
  currentUserId: string | undefined
): string => {
  // If the recipient is the current user, use their first and last name
  if (recipientId === currentUserId && firstName && lastName) {
    return `${firstName[0]}${lastName[0]}`.toUpperCase()
  }
  
  // Otherwise, use the recipient's name
  return recipientName ? getInitials(recipientName) : '??'
}