app.controller("todoController", ["$scope", "$http", function($scope, $http){

	var domain = "http://127.0.0.1:69";
	var http = $http;

	$scope.successMessage = "";
	$scope.showSuccessMessage = false;
	$scope.errorMessage = "";
	$scope.showErrorMessage = false;

	$scope.todos = [];
	$scope.todoToEdit = {}

	$scope.init = function(){
		$scope.getTodos();
	};

	$scope.showSuccess = function(show, message){
		this.showSuccessMessage = show;
		if (show){
			this.successMessage = message; 
		}};

	$scope.showError = function(show, message){
		this.showErrorMessage = show;
		if (show){
			this.errorMessage = message; 
		}};

	$scope.clearMessages = function(){
		$scope.showError(false);
		$scope.showSuccess(false);
	}

	$scope.getTodos = function(){

		http.get(domain + "/todos")
			.success(function(data){
				$scope.todos = data;
			})
			.error(function(data){});};

	$scope.init();

	$scope.addTodo = function(){
		$scope.clearMessages();
		if ($scope.todoMessage == ""){
			$scope.showError(true, "Empty Todo message");
			return;
		}
		var todo = {
			message: $scope.todoMessage,
			dateCreated: new Date()
		}

		http.put(domain + "/todo/add", todo)
		.success(function(data){
			$scope.showSuccess(true, "Todo succesfully added!");
			$scope.init();
		})
		.error(function(data){
			$scope.showError(true, "Error adding Todo");
		});
		$scope.todoMessage =""; };

	$scope.deleteTodo = function(todo){
		$scope.clearMessages();
		http.post(domain + "/todo/delete", todo)
		.success(function(data){
			$scope.showSuccess(true, "Todo succesfully deleted!");
			$scope.init();
		})
		.error(function(data){
			$scope.showError(true, "Error deleting Todo");
		});
	};

	$scope.showEditTodoModal = function(todo){
		$("#editTodoModal").modal("show");
		$scope.todoToEdit = {
			_id: todo._id,
			message: todo.message,
			dateCreated: todo.dateCreated,
			oldMessage: todo.message
		};
	};

	$scope.editTodo = function(){
		$scope.clearMessages();
		var editTodoObject = {
			oldMessage: $scope.todoToEdit.oldMessage,
			newTodo: $scope.todoToEdit
		};
		http.post(domain + "/todo/edit", editTodoObject)
		.success(function(data){
			$("#editTodoModal").modal("hide");
			$scope.showSuccess(true, "Todo succesfully edited!");
			$scope.init();
		})
		.error(function(data){
			$("#editTodoModal").modal("hide");
			$scope.showError(true, "Error editing Todo");
		});
	};
}]);