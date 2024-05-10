/* 
전역변수 vs 지역변수


*/
let active_index = 0;
// 전역변수인 active_index 설정 / 인덱스는 모두 0인덱스부터 시작하기 때문에 0으로 설정함
let len = $('.panel>li').length;
// len = 5 (li의 갯수)
let enable_event = true;
// true로 시작하며, 이벤트가 진행되는 동안에는 true 값을 false로 바꾸며, 이벤트가 종료되면 true로 바꿔줌
// 재이벤트 방지 = 슬라이드가 겹치는 중복현상을 막아주기 위해서 사용
let timer;

$('.next').on('click', function (event) {
	event.preventDefault();
	/* 
    현재 on이라는 활성화 클래스가 붙어있는 순번을 찾고
    => 활성화 클래스가 붙은 순번을 변수에 current_index라고 담겠습니다.
    오리지널 순서는 1 2 3 4 5 (인덱스 순서로는 0 1 2 3 4 -> 0)
    여기에서 current_index를 비교해서 이동할 index의 값과 비교해서
    방향을 설정해서 이동시키게 하는 방법으로 코딩이 되어야함*/

	if (enable_event) {
		enable_event = false;
		// 이벤트가 진행되자마자 false로 바꿔줌으로써 다음 진행을 막아줌(다음 슬라이드로 넘어가지 못하게 막음)

		let current_index = $('.panel>li').filter('.on').index();
		console.log(current_index);
		// --> 0 현재 on클래스가 붙어있는 0인덱스
		let next_index;
		if (current_index != len - 1) {
			next_index = current_index + 1;
		} else {
			next_index = 0;
		}
		active_index = next_index;
		/*위의 코드는 순환하는 슬라이드의 순번을 구해주는 코드임
    최종 순번을 구한값(next_index)을 전역변수인 active_index에 넣어서
    전체적인 슬라이드의 순번을 관리하게 함 -> 싱크를 위해서*/
		show_next(active_index);
	}
});

/* 이동하는 방향에 따른 코드 */
// - 다음으로 이동하는 코드
function show_next(index) {
	console.log('함수호출중');
	console.log(index);
	// li중에 활성화클래스가 있는 li를 움직이게 함 => animate()로 움직이는 것
	// 어떻게, 얼마동안 움직이는지, 움직인 후의 행동은
	// animate() 소괄호 안에서 코딩함
	// animate(어떻게 움직일 것인가, 얼마동안, 움직인 후의 행동)
	$('.panel>li')
		.filter('.on')
		.stop()
		.animate({ left: '-100%' }, 500, function () {
			$(this).removeClass('on').hide();
		});
	// 위 코드는 현재 활성화된 슬라이드 li를 옆으로(넥스트방향으로) 이동하는 코드

	// 이 다음코드는 이후 슬라이드가 나타나게 하는 코드
	$('.panel>li')
		.eq(index)
		.show()
		.css({ left: '100%' })
		.animate({ left: '0%' }, 500, function () {
			$(this).addClass('on');
			enable_event = true;
			// 이벤트가 끝나는 시점에 true로 바꿔줌 (슬라이드가 겹치는 중복현상을 막아줌)
		});
	$('.navi>li>a').removeClass('on');
	$('.navi>li').eq(index).children('a').addClass('on');
}

// - 이전으로 이동하는 코드
$('.prev').on('click', function (event) {
	event.preventDefault();

	if (enable_event) {
		enable_event = false;
	}

	let current_index = $('.panel>li').filter('.on').index();
	let prev_index;
	if (current_index != 0) {
		prev_index = current_index - 1;
	} else {
		prev_index = len - 1;
	}
	active_index = prev_index;
	show_prev(active_index);
});

function show_prev(index) {
	console.log(index);
	$('.panel>li')
		.filter('.on')
		.stop()
		.animate({ left: '100%' }, 500, function () {
			$(this).removeClass('on').hide();
		});

	$('.panel>li')
		.eq(index)
		.show()
		.css({ left: '-100%' })
		.animate({ left: '0%' }, 500, function () {
			$(this).addClass('on');
			enable_event = true;
			// 이벤트가 끝나는 시점에 true로 바꿔줌 (슬라이드가 겹치는 중복현상을 막아줌)
		});
	$('.navi>li>a').removeClass('on');
	$('.navi>li').eq(index).children('a').addClass('on');
}

// 네비버튼을 눌렀을 때 발생 조건에 따라서 함수를 호출함
$('.navi>li').on('click', function (event) {
	event.preventDefault();
	// 현재 활성화클래스가 있는 인덱스를 구함

	// 예: 현재 5번이 보이고 2번을 누르는 상태라면
	// 현재 활성화 클래스가 있는 인덱스는 = 5
	if (enable_event) {
		enable_event = false;

		let current_index = $('.panel>li').filter('.on').index();
		// 타겟인덱스를 구함 (네비버튼을 누른, 즉 가고자하는 타겟) = 2
		let target_index = $(this).index();
		// this = .navi>li 중에서 클릭한 대상 = $('.navi>li').on('click'
		// **중요** - 전역변수와 싱크를 맞춰야함
		active_index = target_index;
		// 만약 활성화인덱스와 타겟인덱스가 같다면? => 아무일이 일어나지 않음
		if (active_index == current_index) {
			enable_event = true;
			return;
		}
		// 만약 활성화인덱스(5)가 타겟인덱스(2)보다 크다면? => prev => 좌측으로 슬라이드 되어야 하기 때문에
		if (active_index > current_index) {
			show_next(active_index);
		}
		// 만약 활성화인덱스(2)가 타겟인덱스(5)보다 작다면? => next => 우측으로 슬라이드 되어야 하기 때문에
		if (active_index < current_index) {
			show_prev(active_index);
		}
	}
});

// 자동으로 롤링되는 슬라이드

$('#start').on('click', function () {
	$('#start').attr('disabled', true);
	$('#stop').attr('disabled', false);
	// 바닐라 자바스크립트에서는 getAttribute 로 속성을 가져와서 setAttribute로 변경하는 과정을 제이쿼리에서는 attr() 하나로 작성됨
	// attr() = 제이쿼리에서 html태그 속성을 변경하는 방법
	// 3초마다 함수를 반복적으로 실행하도록 함
	timer = setInterval(function () {
		// 3항 연산자
		active_index != len - 1 ? active_index++ : (active_index = 0);
		show_next(active_index);
	}, 3000);
});

$('#stop').on('click', function () {
	$('#start').attr('disabled', false);
	$('#stop').attr('disabled', true);

	clearInterval(timer);
});
