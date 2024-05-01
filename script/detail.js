// 뒤로가기 함수 
function backSpace() {
  window.history.back();
}

// 뒤로가기 기능
document.querySelector('.backBtn').addEventListener('click', function() {
  backSpace();
});