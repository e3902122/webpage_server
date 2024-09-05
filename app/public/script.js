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
});