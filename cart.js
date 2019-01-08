import { getCart, changeItem } from "@shopify/theme-cart";
import { formatMoney } from "@shopify/theme-currency";
import EventEmitter from "events";
import { eventTypes } from "./event-types";

if (!window.ShopifyEventEmitter) {
  window.ShopifyEventEmitter = new EventEmitter();
}

export default class CartController {
  removeItemHandler = id => {
    this.$scope.cart.items.filter(lineItem => lineItem.id !== id);
    this._changeItem(id, 0);
  };

  increaseQuantityHandler = id => {
    const item = this.$scope.cart.items.find(lineItem => lineItem.id === id);
    item.quantity = Math.max(0, item.quantity + 1);
    this._changeItem(id, item.quantity);
  };

  decreaseQuantityHandler = id => {
    const item = this.$scope.cart.items.find(lineItem => lineItem.id === id);
    item.quantity = Math.max(0, item.quantity - 1);
    this._changeItem(id, item.quantity);
  };

  refresh = () => {
    this._getCart();
  };

  constructor($scope) {
    "ngInject";

    this.$scope = $scope;
    this.$scope.removeItemHandler = this.removeItemHandler;
    this.$scope.increaseQuantityHandler = this.increaseQuantityHandler;
    this.$scope.decreaseQuantityHandler = this.decreaseQuantityHandler;
    window.ShopifyEventEmitter.on(eventTypes.PRODUCT_ADDED, this.refresh);
  }

  $onInit() {
    this._getCart();
  }

  _getCart() {
    getCart()
      .then(data => {
        console.log(data);
        this.$scope.cart = data;
        return this.$scope.$apply();
      })
      .catch(error => {
        console.log(error);
      });
  }

  _changeItem(id, quantity) {
    changeItem(id, quantity)
      .then(data => {
        this.$scope.cart = data;
        return this.$scope.$apply();
      })
      .catch(error => {
        console.log(error);
      });
  }
}

export function formatMoneyFilter() {
  return function(item) {
    return formatMoney(item);
  };
}
