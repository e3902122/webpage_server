document.getElementById('product-form').addEventListener('submit', async (e) => {
    e.preventDefault();
    const title = document.getElementById('title').value;
    const price = parseFloat(document.getElementById('price').value);
    const imageFile = document.getElementById('image').files[0];

    const formData = new FormData();
    formData.append('title', title);
    formData.append('price', price);
    formData.append('image', imageFile);

    try {
        const response = await fetch('/api/products', {
            method: 'POST',
            body: formData
        });

        if (response.ok) {
            alert('商品添加成功');
            document.getElementById('product-form').reset();
            // 重定向到首頁
            window.location.href = '/';
        } else {
            throw new Error('添加商品失敗');
        }
    } catch (error) {
        alert(error.message);
    }
});