import React, { useState, useMemo } from 'react';

import { useNavigation } from '@react-navigation/native';

import FeatherIcon from 'react-native-vector-icons/Feather';
import {
  Container,
  CartPricing,
  CartButton,
  CartButtonText,
  CartTotalPrice,
} from './styles';

import formatValue from '../../utils/formatValue';

import { useCart } from '../../hooks/cart';

// Calculo do total
// Navegação no clique do TouchableHighlight

const FloatingCart: React.FC = () => {
  const { products } = useCart();

  const navigation = useNavigation();

  //Use memo memoriza tudo o que acontece.
  const cartTotal = useMemo(() => {
    //accumulatora cumula todo retorno, e o product vai ser cada produto do carrinho.
    const total = products.reduce((accumulator, product) => {
      //calculando o preço * a quantidade
      const productsSubtotal = product.price * product.quantity;
      //somando o acumulador com o subtotal
      return accumulator + productsSubtotal;
      //o terceiro parametro é o valor inicial.
    }, 0);

    return formatValue(total);
  }, [products]);

  const totalItensInCart = useMemo(() => {
    //o reduce faz os valores acumularem
    const total = products.reduce((accumulator, product) => {

      //pegando a quantidade de cada produto
      const productsQuantity = product.quantity;

      //somando o acumulador a quantidade de cada produto.
      return accumulator + productsQuantity;
    }, 0);

    return total;
  }, [products]);

  return (
    <Container>
      <CartButton
        testID="navigate-to-cart-button"
        onPress={() => navigation.navigate('Cart')}
      >
        <FeatherIcon name="shopping-cart" size={24} color="#fff" />
        <CartButtonText>{`${totalItensInCart} itens`}</CartButtonText>
      </CartButton>

      <CartPricing>
        <CartTotalPrice>{cartTotal}</CartTotalPrice>
      </CartPricing>
    </Container>
  );
};

export default FloatingCart;
