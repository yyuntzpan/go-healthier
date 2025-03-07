use midTermDB;
-- 前端gym sql查詢語
SELECT 
    gyms.*, 
    GROUP_CONCAT(DISTINCT  features.feature_id) AS feature_id,
    GROUP_CONCAT(DISTINCT  features.feature_name) AS feature_list,
    GROUP_CONCAT( gym_images.image_filename) AS image_list
FROM 
    Gyms gyms
LEFT JOIN 
    GymFeatures gym_features ON gyms.gym_id = gym_features.gym_id
LEFT JOIN 
    Features features ON gym_features.feature_id = features.feature_id
LEFT JOIN 
    GymImages gym_images ON gyms.gym_id = gym_images.gym_id
GROUP BY 
    gyms.gym_id;
    
    show warnings;