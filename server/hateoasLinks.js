let baseUrl = ''
let backendUrl = ''

exports.setBaseUrl = (url) => {
  baseUrl = url
}

exports.setBackendUrl = (url) => {
  backendUrl = url
}

exports.login = () => {
  return {
    description: 'login',
    href: `${backendUrl}/login`,
    method: 'POST'
  }
}

exports.createUser = () => {
  return {
    description: 'Create user',
    href: `${backendUrl}/users`,
    method: 'POST'
  }
}

exports.createUserPage = () => {
  return {
    description: 'Create user',
    href: '/register',
    method: 'GET'
  }
}

exports.getPosts = () => {
  return {
    description: 'Get posts',
    href: `${backendUrl}/posts`,
    method: 'GET'
  }
}

exports.getPostPage = (postID) => {
  return {
    description: 'Get post page',
    href: `/posts/${postID}`,
    method: 'GET'
  }
}

exports.getPostImage = (postID) => {
  return {
    description: 'Get post image',
    href: `${backendUrl}/posts/image/${postID}`,
    method: 'GET'
  }
}

exports.getPostsPage = () => {
  return {
    description: 'Get posts page',
    href: '/posts',
    method: 'GET'
  }
}

exports.getPostsPageOffset = (offset) => {
  return {
    description: 'Get posts page with offset',
    href: `/posts?offset=${offset}`,
    method: 'GET'
  }
}

exports.getCourse = (courseID) => {
  return {
    description: 'Get course',
    href: `${backendUrl}/courses/${courseID}`,
    method: 'GET'
  }
}

exports.getPost = (postID) => {
  return {
    description: 'Get post',
    href: `${backendUrl}/posts/${postID}`,
    method: 'GET'
  }
}
