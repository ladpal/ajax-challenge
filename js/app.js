"use strict";
/*
    app.js, main Angular application script
    define your module and controllers here
*/

var reviewsUrl = 'https://api.parse.com/1/classes/reviews';

angular.module('TalkingBack', ['ui.bootstrap'])
    .config(function($httpProvider) {
        $httpProvider.defaults.headers.common['X-Parse-Application-Id'] = 'igHWCjF6WMhApYBP058UqOR6XAWqe1jWmRqtmXLW';
        $httpProvider.defaults.headers.common['X-Parse-REST-API-Key'] = '9Ve9rAoGoQxdWXLCvGYaxZmOY5mL0WKqCnqmHa6m';
    })

    .controller('ReviewController', function($scope, $http) {

        function refreshReview() {
            $scope.loading = true;
            $scope.hasReviews = true;
            $http.get(reviewsUrl + '?order=-votes')
                .success(function(data) {
                    $scope.reviews = data.results;
                })
                .error(function(err){
                    console.log(err);
                })
                .finally(function() {
                    $scope.loading = false;
                    if ($scope.reviews.length == 0) {
                        $scope.hasReviews = false;
                    }
                });
        }

        refreshReview();

        $scope.deleteReview = function(review) {
            $scope.loading = true;
            $http.delete(reviewsUrl + '/' + review.objectId)
                .success(function (data) {
                    refreshReview();
                })
                .error(function (err) {
                    console.log(err);
                })
                .finally(function () {
                    $scope.loading = false;
                });
        };

        $scope.newReview = {votes: 0};

        $scope.addReview = function(review) {
            $scope.inserting = true;//disabled add task button until inserted
            $http.post(reviewsUrl, review)
                .success(function(responseData) {
                    review.objectId = responseData.objectId;
                    $scope.reviews.push(review);
                })

                .finally(function() {
                    $scope.newReview = {votes: 0};
                    $scope.inserting = false;
                    refreshReview();
                });
        };
        $scope.updateReview = function(review) {
            $scope.updating = true;
            $http.put(reviewsUrl + '/' + review.objectId, review)
                .finally(function() {
                    $scope.updating = false;
                });
        };

        $scope.incrementVotes = function(review, amount) {
            console.log(review.votes);
            if ((review.votes == 0 && amount == -1) || review.votes < 0) {
                window.alert("Uh oh! Zero is the lowest number of votes you can give a review!")
            }
            var postData = {
                votes: {
                    __op: "Increment",
                    amount: amount
                }
            };


            $scope.updating = true;
            $http.put(reviewsUrl + '/' + review.objectId, postData)
                .success(function (respData) {
                    review.votes = respData.votes;
                })
                .error(function (err) {
                    console.log(err);
                })
                .finally(function () {
                    $scope.updating = false;
                });
        };

    });