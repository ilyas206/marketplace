import { useQuery } from '@tanstack/react-query';
import { getProducts, getProductBySlug, getRelatedProducts, getSellerProducts } from '../api/products';

export const useProducts = (filters) => {
  return useQuery({
    queryKey: ['products', filters],
    queryFn: () => getProducts(filters),
  });
};

export const useProduct = (slug) => {
  return useQuery({
    queryKey: ['product', slug],
    queryFn: () => getProductBySlug(slug),
    enabled: !!slug,
  });
};

export const useRelatedProducts = (slug) => {
  return useQuery({
    queryKey: ['products', slug, 'related'],
    queryFn: () => getRelatedProducts(slug),
    enabled: !!slug,
  });
};

export const useSellerPublicProducts = (sellerId) => {
  return useQuery({
    queryKey: ['seller-public-products', sellerId],
    queryFn: () => getSellerProducts(sellerId),
    enabled: !!sellerId,
  });
};