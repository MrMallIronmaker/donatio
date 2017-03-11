Site Location

http://markromanmiller.com/donatio/

# Local Setup

The use of javascript to import other documents will only work when running an http server from this directory. One way to run an http server from your local machine is found here

https://www.npmjs.com/package/http-server

To preview changes locally you will need to disable your browser cache. On chrome this can be found on the network tab of the web developers tab. There should be a checkbox to diable cache.

# Data Schema Specification
The following variables will be stored in the user session through javascript

* searchString : String - represents the string that the user places in the main charity search bar
* searchFilters : Dictionary - mapping between filter category and user selected filters
* savedCharities : Array - list of charityIds that the user has in their cart at the current moment
* comparisonMetrics : Array - list of strings that correspond to comparison metrics selected
* comparisonCharities : Array - list of charity ids that correspond the the charities that are selected on the comparison page
* allocationAmounts : Dictionary - mappng between charityIds that have nonzero allocation and percent allocation

The following variables will be stored statically for this demo

* charityDetails : Dictionary - mapping from charityId to json like object with all details from that charity
* detailsJson - 
  * id : Number - unique identifier associated with the charitiy
  * name : String - name of charity
  * mainPhoto : String - url to charity logo photo
  * website : String - url to charity main website
  * mission : String - mission statement diplayed on details page
  * leadershipTeam : Array - dictionary of leadership data
  * ...

# Known issues
* race condition where static content is needs to finish loading prior to intialization of elements on compare page otherwise the site crashes
