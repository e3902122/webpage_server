document.addEventListener('DOMContentLoaded', function() {
    // 处理表单提交
    const contactForm = document.querySelector('#contact form');
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            alert('感谢您的留言！我们会尽快回复。');
            this.reset();
        });
    }

    // 处理"加入购物车"按钮点击
    const addToCartButtons = document.querySelectorAll('.product-card button');
    addToCartButtons.forEach(button => {
        button.addEventListener('click', function() {
            alert('商品已添加到购物车！');
        });
    });

    // 处理商品上架
    const productForm = document.getElementById('product-form');
    if (productForm) {
        productForm.addEventListener('submit', function(e) {
            e.preventDefault();
            const name = document.getElementById('product-name').value;
            const price = document.getElementById('product-price').value;
            const image = document.getElementById('product-image').value;
            
            // 这里应该发送到服务器，但现在我们只是模拟添加到页面
            addProductToPage(name, price, image);
            
            this.reset();
        });
    }

    function addProductToPage(name, price, image) {
        const productGrid = document.querySelector('.product-grid');
        const productCard = document.createElement('div');
        productCard.className = 'product-card glass';
        productCard.innerHTML = `
            <img src="${image}" alt="${name}">
            <h3>${name}</h3>
            <p>价格: $${price}</p>
            <button>加入购物车</button>
        `;
        productGrid.appendChild(productCard);
    }
});