import { Product } from '../products/product_model';
import { Sale } from '../sales/sale_model';

const getDashboardStats = async () => {
  const [totalProducts, totalSales, lowStockProducts] = await Promise.all([
    Product.countDocuments(),
    Sale.countDocuments(),
    Product.find({ stockQuantity: { $lt: 5 } }).select(
      'name sku stockQuantity sellingPrice image',
    ),
  ]);

  return {
    totalProducts,
    totalSales,
    lowStockProducts,
  };
};

export const dashboardService = {
  getDashboardStats,
};
