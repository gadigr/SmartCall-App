angular.module('clientsService', ['ngResource'])
  .factory('ClientsService',  ['$resource',
    function($resource){
      return $resource('https://smartcall-management.firebaseio.com/clients.json', {}, {
        getData:
        { method:'GET',
          transformResponse: function (data) {
            var ret =  angular.fromJson(data);
            console.log(ret);

              return ret;
            },
          isArray:true
        }
      });
    }]
  );/**
 * Created by gadi on 2/15/2016.
 */
