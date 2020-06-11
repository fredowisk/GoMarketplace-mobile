import React, {
  createContext,
  useState,
  useCallback,
  useContext,
  useEffect,
} from 'react';

import AsyncStorage from '@react-native-community/async-storage';
import api from 'src/services/api';

interface Product {
  id: string;
  title: string;
  image_url: string;
  price: number;
  quantity: number;
}

interface CartContext {
  products: Product[];
  addToCart(item: Omit<Product, 'quantity'>): void;
  increment(id: string): void;
  decrement(id: string): void;
}

const CartContext = createContext<CartContext | null>(null);

const CartProvider: React.FC = ({ children }) => {
  const [products, setProducts] = useState<Product[]>([]);

  useEffect(() => {
    async function loadProducts(): Promise<void> {
      //Criando uma variavel que vai receber os produtos que estão no local storage
      const storagedProducts = await AsyncStorage.getItem(
        '@GoMarketplace:products',
      );

      // Se existir um item no carrinho...
      if (storagedProducts) {
        // ...adicione os produtos.
        setProducts([...JSON.parse(storagedProducts)]);
      }
    }

    loadProducts();
  }, []);

  //Recebendo o product enviado como parametro da função handleAddToCart na pasta Dashboard
  const addToCart = useCallback(
    async product => {
      //Verificando se existe este produto no carrinho
      const productExists = products.find(p => p.id === product.id);

      //Se ele existir...
      if (productExists) {
        setProducts(
          //mapeando todos os products do estado
          products.map(p =>
            //verificando se o id do product é o mesmo do que está sendo passado
            p.id === product.id
              ? //se sim, passo todas as informações atualizadas, e pego a quantidade e adiciono +1
                { ...product, quantity: p.quantity + 1 }
              : p,
          ),
        );
      } else {
        //Se ele não existir, eu pego todos os products e os adiciono novamente,
        //pego todos os valores do product passado como parametro, e adiciono a quantidade 1.
        setProducts([...products, { ...product, quantity: 1 }]);
      }
      //Adicionando os produtos ao local storage
      await AsyncStorage.setItem(
        '@GoMarketplace:products',
        JSON.stringify(products),
      );
    },
    [products],
  );

  //verificando se o id do product é igual ao do parâmetro
  //eu retorno cada produto, e somo sua quantidade em +1
  //e se não for igual eu retorno ele.
  const increment = useCallback(
    async id => {
      const newProducts = products.map(product =>
        product.id === id
          ? { ...product, quantity: product.quantity + 1 }
          : product,
      );

      setProducts(newProducts);

      await AsyncStorage.setItem(
        '@GoMarketplace:products',
        JSON.stringify(newProducts),
      );
    },
    [products],
  );

  //verificando se o id do product é igual ao do parâmetro
  //eu retorno cada produto, e subtraio sua quantidade em -1
  //e se não for igual eu retorno ele.
  const decrement = useCallback(
    async id => {
      const newProducts = products.map(product =>
        product.id === id
          ? { ...product, quantity: product.quantity - 1 }
          : product,
      );

      setProducts(newProducts);

      await AsyncStorage.setItem(
        '@GoMarketplace:products',
        JSON.stringify(newProducts),
      );
    },
    [products],
  );

  const value = React.useMemo(
    () => ({ addToCart, increment, decrement, products }),
    [products, addToCart, increment, decrement],
  );

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
};

function useCart(): CartContext {
  const context = useContext(CartContext);

  if (!context) {
    throw new Error(`useCart must be used within a CartProvider`);
  }

  return context;
}

export { CartProvider, useCart };
