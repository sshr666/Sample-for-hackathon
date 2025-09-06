#include<bits/stdc++.h>
using namespace std;

class Solution {
public:
    int trap(vector<int>& height) {
        int ans=0, l=0, r= height.size()-1;

        while(height[l]<height[l+1])
            l++;

        while (height[r]<height[r-1])
        {
            r--;
        }
        

        while(l<r)
        {
            
        }
    }
};
