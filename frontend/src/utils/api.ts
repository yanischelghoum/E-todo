const API_URL = 'http://localhost:3000';


export interface RegisterData {
  email: string;
  name: string;
  firstname: string;
  password: string;
}

export interface LoginData {
  email: string;
  password: string;
}

export interface AuthResponse {
  token: string;
}

export interface User {
  id: number;
  username: string;
  firstname: string;
  lastname: string;
  email: string;
  phone?: string;
  password: string;
  created_at: string;
}


export interface Todo {
  id: number;
  title: string;
  description: string;
  created_at: string;
  due_time: string;
  user_id: number;
  status: 'not started' | 'todo' | 'in progress' | 'done';
}

export interface CreateTodoData {
  title: string;
  description: string;
  due_time: string;
  user_id: number;
  status?: 'not started' | 'todo' | 'in progress' | 'done';
}

export interface UpdateTodoData {
  title?: string;
  description?: string;
  due_time?: string;
  user_id?: number;
  status?: 'not started' | 'todo' | 'in progress' | 'done';
}


export const getToken = (): string | null => {
  if (typeof window !== "undefined") {
    return localStorage.getItem("token");
  }
  return null;
};

export const saveToken = (token: string): void => {
  if (typeof window !== 'undefined') {
    localStorage.setItem('token', token);
  }
};

export const removeToken = (): void => {
  if (typeof window !== 'undefined') {
    localStorage.removeItem('token');
  }
};

export const isAuthenticated = (): boolean => {
  return getToken() !== null;
};


export const register = async (userData: RegisterData): Promise<AuthResponse> => {
  const response = await fetch(`${API_URL}/register`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(userData),
  });
  
  const data = await response.json();
  
  if (!response.ok) {
    throw new Error(data.msg || 'Registration failed');
  }
  
  return data;
};

export const login = async (credentials: LoginData): Promise<AuthResponse> => {
  const response = await fetch(`${API_URL}/login`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(credentials),
  });
  
  const data = await response.json();
  
  if (!response.ok) {
    throw new Error(data.msg || 'Login failed');
  }
  
  return data;
};


export const getCurrentUser = async (): Promise<User> => {
  const token = getToken();
  if (!token) {
    throw new Error("No token found");
  }

  const response = await fetch(`${API_URL}/user/me`, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.msg || data.message || "Failed to get user");
  }

  return data;
};

export const getUserTodos = async (): Promise<Todo[]> => {
  const token = getToken();
  
  if (!token) {
    throw new Error('No token found');
  }
  
  const response = await fetch(`${API_URL}/user/todos`, {
    method: 'GET',
    headers: {
      'Authorization': token,
    },
  });
  
  const data = await response.json();
  
  if (!response.ok) {
    throw new Error(data.msg || 'Failed to get todos');
  }
  
  return data;
};


export const getAllTodos = async (): Promise<Todo[]> => {
  const token = getToken();
  
  if (!token) {
    throw new Error('No token found');
  }
  
  const response = await fetch(`${API_URL}/todos`, {
    method: 'GET',
    headers: {
      'Authorization': token,
    },
  });
  
  const data = await response.json();
  
  if (!response.ok) {
    throw new Error(data.msg || 'Failed to get todos');
  }
  
  return data;
};

export const getTodoById = async (id: number): Promise<Todo> => {
  const token = getToken();
  
  if (!token) {
    throw new Error('No token found');
  }
  
  const response = await fetch(`${API_URL}/todos/${id}`, {
    method: 'GET',
    headers: {
      'Authorization': token,
    },
  });
  
  const data = await response.json();
  
  if (!response.ok) {
    throw new Error(data.msg || 'Failed to get todo');
  }
  
  return data;
};

export const createTodo = async (todoData: CreateTodoData): Promise<Todo> => {
  const token = getToken();
  
  if (!token) {
    throw new Error('No token found');
  }
  
  const response = await fetch(`${API_URL}/todos`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': token,
    },
    body: JSON.stringify(todoData),
  });
  
  const data = await response.json();
  
  if (!response.ok) {
    throw new Error(data.msg || 'Failed to create todo');
  }
  
  return data;
};

export const updateTodo = async (id: number, todoData: UpdateTodoData): Promise<Todo> => {
  const token = getToken();
  
  if (!token) {
    throw new Error('No token found');
  }
  
  const response = await fetch(`${API_URL}/todos/${id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': token,
    },
    body: JSON.stringify(todoData),
  });
  
  const data = await response.json();
  
  if (!response.ok) {
    throw new Error(data.msg || 'Failed to update todo');
  }
  
  return data;
};

export const deleteTodo = async (id: number): Promise<{ msg: string }> => {
  const token = getToken();
  
  if (!token) {
    throw new Error('No token found');
  }
  
  const response = await fetch(`${API_URL}/todos/${id}`, {
    method: 'DELETE',
    headers: {
      'Authorization': token,
    },
  });
  
  const data = await response.json();
  
  if (!response.ok) {
    throw new Error(data.msg || 'Failed to delete todo');
  }
  
  return data;
};