using UnityEngine;
using System.Collections;
using System.Collections.Generic;
using UnityEngine.AI;

public class Projectile : MonoBehaviour
{
    public NavMeshAgent enemy;
    public Transform player;

    [SerializeField] private float timer = 2;
    private float bulletTime;

    public GameObject enemyBullet;
    public Transform spawnPoint;


    void Update()
    {
        ShootAtPlayer();
    }


    void ShootAtPlayer()
    {
        bulletTime -= Time.deltaTime;

        if(bulletTime > 0) return;

        bulletTime = timer;

        GameObject bulletObj = Instantiate(enemyBullet, spawnPoint.transform.position, spawnPoint.transform.rotation) as GameObject;
        Rigidbody bulletRig = bulletObj.GetComponent<Rigidbody>();
        bulletRig.AddForce(bulletRig.transform.forward);
        Destroy(bulletObj, 2f);
    }
}
