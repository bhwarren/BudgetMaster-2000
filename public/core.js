var BudgetMaster = angular.module('BudgetMaster2000', []);

function mainController($scope, $http) {
    $scope.formData = {};
    $scope.hideBudgetButton = true;

    // when landing on the page, get all todos and show them
    $http.get('/budget/api/charges')
        .success(function(data) {
            $scope.charges = data;
            console.log(data);
        })
        .error(function(data) {
            console.log('Error: ' + data);
        });

	$scope.addCharge = function() {
        console.log($scope.formData);
        $http.post('/budget/api/charges', $scope.formData)
            .success(function(data) {
                console.log(data);

                $scope.formData = {}; // clear the form so our user is ready to enter another
                $scope.charges = data;
            })
            .error(function(data) {
                console.log('Error: ' + data);
            });
    };

    $scope.setBudget = function(){
        $http.post('/budget/api/setBudget', {"budget": $scope.charges.budget})
            .success(function(data) {
                console.log(data);

                $scope.newBudget = data.bud; // clear the form so our user is ready to enter another
                $scope.charges = data;
            })
            .error(function(data) {
                console.log('Error: ' + data);
            });

        $scope.hideBudgetButton = true;
    };

    $scope.clear = function(){
            $http.get('/budget/api/clear')
                .success(function(data) {
                    $scope.charges = data;
                    console.log(data);
                })
                .error(function(data) {
                    console.log('Error: ' + data);
                });
    };

    $scope.showBudgetButton = function(){
        $scope.hideBudgetButton = false;
    };



}
