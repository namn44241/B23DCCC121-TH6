import { useRouter } from "@tanstack/react-router";
import { toast } from "sonner";

export const getRequestHeaders = () => {
    const headers: HeadersInit = {
      'Content-Type': 'application/json',
    };
    
    const token = localStorage.getItem('token');
    if (token) {
      headers.Authorization = `Bearer ${token}`;
    }
    
    return headers;
}

export const handleResponse = async (response: Response) => {
    const router = useRouter();
    // loi khong xac thuc
    if (response.status === 401) {
      localStorage.removeItem('token');
      router.navigate({ to: "/" });
      toast.error("Please sign in to continue.");
    }
    
    // loi khac
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      toast.error(errorData.message || `Error ${response.status}`);
    }
    
    // khong co du lieu tra ve
    if (response.status === 204) {
      return null;
    }
    
    // co du lieu tra ve
    return response.json();
  };
